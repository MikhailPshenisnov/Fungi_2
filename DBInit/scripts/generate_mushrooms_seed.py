#!/usr/bin/env python3
from __future__ import annotations

import csv
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

PLACEHOLDER_HEADER_PHOTO = "/media/mushrooms/placeholder.webp"
DEFAULT_EATABLE = "Неизвестно"
MUSHROOM_NAMESPACE = uuid.UUID("d6b2bf21-1981-4a9f-a38f-0f0dd30a1b74")


@dataclass(frozen=True)
class MushroomRow:
    id: str
    revision_id: str
    name: str
    synonymous_name: str | None
    family: str
    red_book: bool
    eatable: str
    has_stem: bool
    stem_size_from: int | None
    stem_size_to: int | None
    stem_type: str | None
    stem_color: str | None
    cap_type: str
    cap_color: str
    cap_underside_type: str
    description: str
    header_photo_link: str
    extra_photo_links: str | None
    doppelgangers: tuple[str, ...]


@dataclass(frozen=True)
class CsvColumns:
    name: str
    synonymous: str
    family: str
    red_book: str
    has_stem: str
    stem_from: str
    stem_to: str
    stem_type: str
    stem_color: str
    cap_type: str
    cap_color: str
    cap_underside: str
    description: str
    doppelgangers: str
    photos: str


def normalize_text(value: str | None) -> str:
    if value is None:
        return ""

    value = value.replace("\u00a0", " ").strip()
    if not value:
        return ""

    return " ".join(value.split())


def normalize_optional(value: str | None) -> str | None:
    normalized = normalize_text(value)
    return normalized or None


def normalize_photo_url(value: str | None) -> str:
    normalized = normalize_text(value)
    if not normalized:
        return ""

    if "drive.google.com" in normalized:
        if "uc?export=view&id=" in normalized:
            return normalized

        if "open?id=" in normalized:
            file_id = normalized.split("open?id=", 1)[1].split("&", 1)[0]
            if file_id:
                return f"https://drive.google.com/uc?export=view&id={file_id}"

        if "/file/d/" in normalized:
            file_id = normalized.split("/file/d/", 1)[1].split("/", 1)[0]
            if file_id:
                return f"https://drive.google.com/uc?export=view&id={file_id}"

    return normalized


def split_photo_links(value: str | None) -> list[str]:
    normalized = normalize_text(value)
    if not normalized:
        return []

    links = [normalize_photo_url(part) for part in normalized.split(",")]
    return [link for link in links if link]


def detect_columns(header: list[str]) -> CsvColumns:
    def pick(substring: str, *, exclude: str | None = None) -> str:
        for column in header:
            normalized = normalize_text(column).lower()
            if substring in normalized and (exclude is None or exclude not in normalized):
                return column
        raise RuntimeError(f"Column not found: {substring}")

    return CsvColumns(
        name=pick("наименование", exclude="синонимич"),
        synonymous=pick("синонимич"),
        family=pick("семейство"),
        red_book=pick("красная книга"),
        has_stem=pick("есть ли ножка"),
        stem_from=pick("размер ножки от"),
        stem_to=pick("размер ножки до"),
        stem_type=pick("тип ножки"),
        stem_color=pick("цвет ножки"),
        cap_type=pick("тип шляпки"),
        cap_color=pick("цвет шляпки"),
        cap_underside=pick("под шляпкой"),
        description=pick("описание гриба"),
        doppelgangers=pick("двойники"),
        photos=pick("фотограф"),
    )


def parse_int(value: str | None) -> int | None:
    normalized = normalize_text(value)
    if not normalized:
        return None

    try:
        return int(normalized)
    except ValueError:
        return None


def parse_yes_no(value: str | None) -> bool | None:
    normalized = normalize_text(value).lower()
    if normalized == "да":
        return True
    if normalized == "нет":
        return False
    return None


def split_doppelgangers(value: str | None) -> tuple[str, ...]:
    normalized = normalize_text(value)
    if not normalized:
        return tuple()

    seen: set[str] = set()
    values: list[str] = []

    for part in normalized.split(","):
        candidate = normalize_text(part)
        if not candidate:
            continue

        key = candidate.casefold()
        if key in seen:
            continue

        seen.add(key)
        values.append(candidate)

    return tuple(values)


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def sql_nullable(value: str | None) -> str:
    if value is None:
        return "NULL"
    return sql_quote(value)


def sql_bool(value: bool) -> str:
    return "true" if value else "false"


def sql_nullable_int(value: int | None) -> str:
    if value is None:
        return "NULL"
    return str(value)


def build_uuid(label: str) -> str:
    return str(uuid.uuid5(MUSHROOM_NAMESPACE, label))


def load_rows(csv_path: Path) -> tuple[list[MushroomRow], dict[str, int]]:
    with csv_path.open("r", encoding="utf-8-sig", newline="") as source_file:
        reader = csv.DictReader(source_file, delimiter=";")
        if reader.fieldnames is None:
            raise RuntimeError("CSV has no header")

        columns = detect_columns(list(reader.fieldnames))

        seen_names: set[str] = set()
        result: list[MushroomRow] = []
        dropped_duplicates = 0
        dropped_invalid_stem = 0

        for row in reader:
            name = normalize_text(row.get(columns.name))
            if not name:
                continue

            dedupe_key = name.casefold()
            if dedupe_key in seen_names:
                dropped_duplicates += 1
                continue

            seen_names.add(dedupe_key)

            family = normalize_text(row.get(columns.family))
            cap_type = normalize_text(row.get(columns.cap_type))
            cap_color = normalize_text(row.get(columns.cap_color))
            cap_underside = normalize_text(row.get(columns.cap_underside))
            description = normalize_text(row.get(columns.description))
            photos = split_photo_links(row.get(columns.photos))

            if not all((family, cap_type, cap_color, cap_underside, description)):
                dropped_invalid_stem += 1
                continue

            has_stem = parse_yes_no(row.get(columns.has_stem))
            stem_from = parse_int(row.get(columns.stem_from))
            stem_to = parse_int(row.get(columns.stem_to))
            stem_type = normalize_optional(row.get(columns.stem_type))
            stem_color = normalize_optional(row.get(columns.stem_color))

            is_valid_stem = True
            if has_stem is None:
                is_valid_stem = False
            elif has_stem:
                if stem_from is None or stem_to is None or stem_type is None or stem_color is None:
                    is_valid_stem = False
                elif stem_from < 0 or stem_to < 0:
                    is_valid_stem = False
                elif stem_from > stem_to:
                    stem_from, stem_to = stem_to, stem_from
            else:
                if stem_from is not None or stem_to is not None or stem_type is not None or stem_color is not None:
                    is_valid_stem = False

            if not is_valid_stem:
                dropped_invalid_stem += 1
                continue

            mushroom_id = build_uuid(f"mushroom:{name}")
            revision_id = build_uuid(f"mushroom:revision:published:{name}")

            result.append(
                MushroomRow(
                    id=mushroom_id,
                    revision_id=revision_id,
                    name=name,
                    synonymous_name=normalize_optional(row.get(columns.synonymous)),
                    family=family,
                    red_book=normalize_text(row.get(columns.red_book)).casefold() == "да",
                    eatable=DEFAULT_EATABLE,
                    has_stem=has_stem,
                    stem_size_from=stem_from,
                    stem_size_to=stem_to,
                    stem_type=stem_type,
                    stem_color=stem_color,
                    cap_type=cap_type,
                    cap_color=cap_color,
                    cap_underside_type=cap_underside,
                    description=description,
                    header_photo_link=photos[0] if photos else PLACEHOLDER_HEADER_PHOTO,
                    extra_photo_links=";".join(photos[1:]) if len(photos) > 1 else None,
                    doppelgangers=split_doppelgangers(row.get(columns.doppelgangers)),
                )
            )

    stats = {
        "total_loaded": len(result),
        "dropped_duplicates": dropped_duplicates,
        "dropped_invalid_stem": dropped_invalid_stem,
    }

    return result, stats


def build_owner_cte() -> str:
    return """
WITH owner AS (
    SELECT COALESCE(
        (
            SELECT u."Id"
            FROM public."Users" u
            JOIN public."Roles" r ON r."Id" = u."RoleId"
            WHERE r."AccessLevel" = 0
            ORDER BY u."Id"
            LIMIT 1
        ),
        (
            SELECT u."Id"
            FROM public."Users" u
            ORDER BY u."Id"
            LIMIT 1
        )
    ) AS "UserId"
)
""".strip()


def build_mushrooms_insert(rows: Iterable[MushroomRow], *, on_conflict_do_nothing: bool) -> str:
    values: list[str] = []

    for row in rows:
        values.append(
            "(" + ", ".join(
                [
                    sql_quote(row.id),
                    sql_quote(row.name),
                    sql_nullable(row.synonymous_name),
                    "NULL",
                    sql_quote(row.family),
                    sql_bool(row.red_book),
                    sql_quote(row.eatable),
                    sql_bool(row.has_stem),
                    sql_nullable_int(row.stem_size_from),
                    sql_nullable_int(row.stem_size_to),
                    sql_nullable(row.stem_type),
                    sql_nullable(row.stem_color),
                    sql_quote(row.cap_type),
                    sql_quote(row.cap_color),
                    sql_quote(row.cap_underside_type),
                    sql_quote(row.description),
                    sql_quote(row.header_photo_link),
                    sql_nullable(row.extra_photo_links),
                ]
            ) + ")"
        )

    statement = [
        'INSERT INTO public."Mushrooms" ("Id", "Name", "SynonymousName", "LatinName", "Family", "RedBook", "Eatable", "HasStem",',
        '                                "StemSizeFrom", "StemSizeTo", "StemType", "StemColor", "CapType", "CapColor",',
        '                                "CapUndersideType", "Description", "HeaderPhotoLink", "ExtraPhotoLinks")',
        "VALUES",
        ",\n".join(values) + "",
    ]

    if on_conflict_do_nothing:
        statement.append('ON CONFLICT ("Id") DO NOTHING;')
    else:
        statement[-1] += ";"

    return "\n".join(statement)


def build_doppelgangers_insert(rows: Iterable[MushroomRow], *, on_conflict_do_nothing: bool) -> str:
    values: list[str] = []

    for row in rows:
        for index, doppelganger in enumerate(row.doppelgangers, start=1):
            doppelganger_id = build_uuid(f"mushroom:doppel:{row.name}:{index}:{doppelganger}")
            values.append(
                "(" + ", ".join([sql_quote(doppelganger_id), sql_quote(row.id), sql_quote(doppelganger)]) + ")"
            )

    if not values:
        return "-- no mushroom doppelgangers"

    statement = [
        'INSERT INTO public."Doppelgangers" ("Id", "MushroomId", "DoppelgangerName")',
        "VALUES",
        ",\n".join(values),
    ]

    if on_conflict_do_nothing:
        statement.append('ON CONFLICT ("Id") DO NOTHING;')
    else:
        statement[-1] += ";"

    return "\n".join(statement)


def build_revisions_insert(rows: Iterable[MushroomRow], *, on_conflict_do_nothing: bool) -> str:
    values: list[str] = []

    for row in rows:
        values.append(
            "(" + ", ".join(
                [
                    f"{sql_quote(row.revision_id)}::uuid",
                    f"{sql_quote(row.id)}::uuid",
                    sql_quote(row.name),
                    sql_nullable(row.synonymous_name),
                    "NULL",
                    sql_quote(row.family),
                    sql_bool(row.red_book),
                    sql_quote(row.eatable),
                    sql_bool(row.has_stem),
                    sql_nullable_int(row.stem_size_from),
                    sql_nullable_int(row.stem_size_to),
                    sql_nullable(row.stem_type),
                    sql_nullable(row.stem_color),
                    sql_quote(row.cap_type),
                    sql_quote(row.cap_color),
                    sql_quote(row.cap_underside_type),
                    sql_quote(row.description),
                    sql_quote(row.header_photo_link),
                    sql_nullable(row.extra_photo_links),
                ]
            ) + ")"
        )

    statement = [
        build_owner_cte(),
        'INSERT INTO public."MushroomRevisions" ("Id", "SourceMushroomId", "Name", "SynonymousName", "LatinName", "Family", "RedBook", "Eatable", "HasStem",',
        '                                        "StemSizeFrom", "StemSizeTo", "StemType", "StemColor", "CapType", "CapColor",',
        '                                        "CapUndersideType", "Description", "HeaderPhotoLink", "ExtraPhotoLinks", "Status",',
        '                                        "CreatedByUserId", "UpdatedByUserId", "CreatedAt", "UpdatedAt", "PublishedAt")',
        'SELECT v."Id", v."SourceMushroomId", v."Name", v."SynonymousName", v."LatinName", v."Family", v."RedBook", v."Eatable", v."HasStem",',
        '       v."StemSizeFrom", v."StemSizeTo", v."StemType", v."StemColor", v."CapType", v."CapColor",',
        '       v."CapUndersideType", v."Description", v."HeaderPhotoLink", v."ExtraPhotoLinks",',
        "       'Published', owner.\"UserId\", owner.\"UserId\", now(), now(), now()",
        "FROM (VALUES",
        ",\n".join(values),
        ') AS v("Id", "SourceMushroomId", "Name", "SynonymousName", "LatinName", "Family", "RedBook", "Eatable", "HasStem",',
        '       "StemSizeFrom", "StemSizeTo", "StemType", "StemColor", "CapType", "CapColor",',
        '       "CapUndersideType", "Description", "HeaderPhotoLink", "ExtraPhotoLinks")',
        "CROSS JOIN owner",
    ]

    if on_conflict_do_nothing:
        statement.append('ON CONFLICT ("Id") DO NOTHING;')
    else:
        statement[-1] += ";"

    return "\n".join(statement)


def build_revision_doppelgangers_insert(rows: Iterable[MushroomRow], *, on_conflict_do_nothing: bool) -> str:
    values: list[str] = []

    for row in rows:
        for index, doppelganger in enumerate(row.doppelgangers, start=1):
            doppelganger_id = build_uuid(f"mushroom:revision:doppel:{row.name}:{index}:{doppelganger}")
            values.append(
                "(" + ", ".join([sql_quote(doppelganger_id), sql_quote(row.revision_id), sql_quote(doppelganger)]) + ")"
            )

    if not values:
        return "-- no mushroom revision doppelgangers"

    statement = [
        'INSERT INTO public."MushroomRevisionDoppelgangers" ("Id", "RevisionId", "DoppelgangerName")',
        "VALUES",
        ",\n".join(values),
    ]

    if on_conflict_do_nothing:
        statement.append('ON CONFLICT ("Id") DO NOTHING;')
    else:
        statement[-1] += ";"

    return "\n".join(statement)


def build_header(rows: list[MushroomRow], stats: dict[str, int]) -> list[str]:
    return [
        "-- AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.",
        "-- Source: DBInit/data/mushrooms.csv",
        f"-- Baseline mushrooms: {stats['total_loaded']}",
        f"-- Dropped rows: duplicates={stats['dropped_duplicates']}, invalid_stem={stats['dropped_invalid_stem']}",
        "",
    ]


def write_seed_sql(rows: list[MushroomRow], stats: dict[str, int], output_path: Path) -> None:
    lines = build_header(rows, stats)
    lines.extend(
        [
            build_mushrooms_insert(rows, on_conflict_do_nothing=True),
            "",
            build_doppelgangers_insert(rows, on_conflict_do_nothing=True),
            "",
            build_revisions_insert(rows, on_conflict_do_nothing=True),
            "",
            build_revision_doppelgangers_insert(rows, on_conflict_do_nothing=True),
            "",
        ]
    )
    output_path.write_text("\n".join(lines), encoding="utf-8")


def write_replace_sql(rows: list[MushroomRow], stats: dict[str, int], output_path: Path) -> None:
    lines = build_header(rows, stats)
    lines.extend(
        [
            "BEGIN;",
            "",
            '-- Full replace of mushroom domain: removes existing mushrooms, revisions, likes and links.',
            'DELETE FROM public."MushroomRevisionDoppelgangers";',
            'DELETE FROM public."MushroomRevisions";',
            'DELETE FROM public."MushroomLikes";',
            'DELETE FROM public."Doppelgangers";',
            'DELETE FROM public."ArticleMushrooms";',
            'DELETE FROM public."Mushrooms";',
            "",
            build_mushrooms_insert(rows, on_conflict_do_nothing=False),
            "",
            build_doppelgangers_insert(rows, on_conflict_do_nothing=False),
            "",
            build_revisions_insert(rows, on_conflict_do_nothing=False),
            "",
            build_revision_doppelgangers_insert(rows, on_conflict_do_nothing=False),
            "",
            "COMMIT;",
            "",
        ]
    )
    output_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    csv_path = root / "DBInit" / "data" / "mushrooms.csv"
    seed_output = root / "DBInit" / "6-seed-mushrooms-csv.sql"
    replace_output = root / "DBInit" / "6-replace-mushrooms-csv.sql"

    rows, stats = load_rows(csv_path)

    expected_count = 482
    if stats["total_loaded"] != expected_count:
        raise RuntimeError(
            f"Unexpected baseline size: {stats['total_loaded']}, expected {expected_count}. "
            "Check CSV normalization rules before regenerating seeds."
        )

    write_seed_sql(rows, stats, seed_output)
    write_replace_sql(rows, stats, replace_output)

    print(f"Generated: {seed_output}")
    print(f"Generated: {replace_output}")
    print(
        "Summary: "
        f"total={stats['total_loaded']}, "
        f"dropped_duplicates={stats['dropped_duplicates']}, "
        f"dropped_invalid_stem={stats['dropped_invalid_stem']}"
    )


if __name__ == "__main__":
    main()
