# Fungi_2 - Мобильная разработка

Репозиторий для реализации новой версии приложения для проекта "Fungi" под iOS/Android.

## Подготовка в работе
Скачайте фреймворк expo (и node.js если не установлен)   
[Expo](https://docs.expo.dev/get-started/create-a-project/)   
[node.js](https://nodejs.org/en/download)   

## 🚀 Подготовка 
### 1. Клонирование проекта

```
# Склонируйте репозиторий
git clone https://github.com/MikhailPshenisnov/Fungi_2/

# Перейдите в папку проекта
cd Fungi_2

# перейдите еще дальше
cd mobile-dev

# Показать все удаленные ветки (должна быть origin/mobile-dev)
git branch -r

# Загрузить удалённую ветку к себе локально и перейти на нее
git checkout mobile-dev
```

### 2.Откройте проект в любой среде разработки (Я использую VS code)

В терминале (в директории проекта)  введите:   
```
npm install
```
Это создаст папку node_modules в которой будут храниться все зависимости и библиотеки проекта.\
Она весит много поэтому добавлена в .gitignore

### 3. Скачайте Expo Go Для просмотра проекта со своего телефона
*[iOs](https://apps.apple.com/us/app/expo-go/id982107779)
*[Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=ru)

## Начало работы
Для запуска проекта воспользуйтесь командой
```
npm start
```
Должен появиться QR-код. Сканируйте его с помощью телефона и у вас откроется ваше приложение

### 4. Дефолтные ошибки 
Package-name -- имя пакета (условно 'expo')
version -версия (улсовно 54.0.33)
## 4.1 Unable to resolve package-name@version
У вас скорее всего не установлен пакет 'package-name'
решение:
```
npm install package-name@version
```

## 4.2 Package-name@verion1 expected version version2
У вас установлена версия 'version1', а рекомендуемая версия -- version2 (лучше установить новую)
решение:
```
npm install package-name@version2
```

## 4.3 Could not read package.json
Скорее всего вы не в директории проекта
Запуск npm start должен производится из директории с файлом package.json
решение:
посмотри файлы директории командами ls или dir
если файла package.json нет продолите поиски по ближайшим каталогам
каталог верхнего уровня 
``` 
cd ..
```
каталоги нижнего уровня
```
ls
name1 name2 name3 name4
cd name1
```
где name1-4 это вывод команды ls (или же dir для виндовс) 





