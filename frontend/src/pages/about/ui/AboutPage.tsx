import { Link } from 'react-router-dom';
import { Card, Container, Stack, Typography } from '@shared/ui';
import { PageLayout } from '@widgets/layout';
import styles from './AboutPage.module.css';

const productFeatures = [
  {
    title: 'Каталог грибов',
    description: 'Собираем карточки по видам, признакам и базовым характеристикам для быстрых сверок.'
  },
  {
    title: 'Статьи и разборы',
    description: 'Публикуем понятные материалы по распознаванию, безопасности и типичным ошибкам.'
  },
  {
    title: 'Избранное',
    description: 'Сохраняйте полезные материалы и возвращайтесь к ним без повторного поиска.'
  },
  {
    title: 'История просмотров',
    description: 'Недавно открытые карточки и статьи доступны в профиле.'
  },
  {
    title: 'Личный профиль',
    description: 'Храните аватар, избранные материалы и историю просмотров в одном месте.'
  },
  {
    title: 'Персональные разделы',
    description: 'Интерфейс подстраивается под ваш формат использования сервиса.'
  }
];

const contentWorkflow = [
  {
    title: 'Сбор информации',
    description: 'Сначала собираем исходные данные и формируем черновик карточек/материалов.'
  },
  {
    title: 'Редактура',
    description: 'Контент проходит внутреннюю проверку на ясность формулировок и отсутствие двусмысленностей.'
  },
  {
    title: 'Публикация и обновление',
    description: 'После релиза отслеживаем обратную связь и корректируем материалы по фактическим кейсам.'
  }
];

const teamMembers = [
  {
    title: 'Понятно и по делу',
    description: 'Объясняем сложные темы простым языком без перегруза лишними деталями.'
  },
  {
    title: 'Постоянно улучшаем',
    description: 'Регулярно обновляем карточки и статьи, чтобы сервис оставался полезным.'
  },
  {
    title: 'Слушаем пользователей',
    description: 'Учитываем обратную связь и быстро исправляем найденные неточности.'
  }
];

const values = [
  'Практичность',
  'Понятный язык',
  'Проверяемость данных',
  'Безопасность выше скорости',
  'Единый контракт API',
  'Честная документация'
];

const roadmap = [
  {
    status: 'Сделано',
    title: 'Профиль + аватары',
    description: 'Загрузка/удаление аватара, fallback и обновление профиля.'
  },
  {
    status: 'Сделано',
    title: 'Более умный профиль',
    description: 'Разделы профиля стали персональнее и удобнее для разных сценариев.'
  },
  {
    status: 'В работе',
    title: 'Новые разделы профиля',
    description: 'Расширяем вкладки и персональные функции внутри аккаунта.'
  },
  {
    status: 'Дальше',
    title: 'Углубление контента',
    description: 'Расширение карточек грибов, улучшение справочников и публикаций.'
  }
];

const statusClassByLabel: Record<string, string> = {
  'Сделано': styles.statusDone,
  'В работе': styles.statusInProgress,
  'Дальше': styles.statusNext
};

export function AboutPage() {
  return (
    <PageLayout>
      <div className={styles.page}>
        <section className={styles.hero}>
          <Container size="lg">
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <Typography variant="meta" className={styles.heroMeta}>
                  О проекте Fungi
                </Typography>
                <Typography variant="h1" className={styles.heroTitle}>
                  Делаем удобную энциклопедию о грибах для ежедневной практики
                </Typography>
                <Typography variant="bodyL" className={styles.heroLead}>
                  Наша цель: помочь быстрее ориентироваться в карточках грибов и тематических материалах,
                  не перегружая интерфейс и не теряя акцент на безопасности.
                </Typography>
                <div className={styles.heroActions}>
                  <Link to="/#mushrooms" className={styles.primaryLink}>
                    Перейти к каталогу
                  </Link>
                  <Link to="/#articles" className={styles.secondaryLink}>
                    Читать статьи
                  </Link>
                </div>
              </div>

              <Card className={styles.heroPanel}>
                <Stack gap={12}>
                  <Typography variant="h4">Почему мы это делаем</Typography>
                  <Typography variant="bodyS" className={styles.mutedText}>
                    В теме грибов много разрозненных источников и сложных описаний. Мы собираем данные в единую
                    структуру и даем понятный вход для новичков и практикующих грибников.
                  </Typography>
                  <div className={styles.heroKpis}>
                    <div>
                      <Typography variant="h3">1K+</Typography>
                      <Typography variant="caption" className={styles.mutedText}>
                        карточек и материалов в развитии
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h3">Для новичков и опытных</Typography>
                      <Typography variant="caption" className={styles.mutedText}>
                        понятный и аккуратный интерфейс
                      </Typography>
                    </div>
                  </div>
                </Stack>
              </Card>
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <div className={styles.sectionHeader}>
              <Typography variant="meta">Проблема и идея</Typography>
              <Typography variant="h2">Что хотим улучшить для пользователей</Typography>
            </div>
            <div className={styles.twoColumnGrid}>
              <Card className={styles.sectionCard}>
                <Stack gap={10}>
                  <Typography variant="h4">Проблема</Typography>
                  <Typography variant="bodyS" className={styles.mutedText}>
                    Информация о грибах часто разбросана, а важные признаки подаются неструктурно. В результате
                    сложнее сравнивать виды и принимать осторожные решения.
                  </Typography>
                </Stack>
              </Card>
              <Card className={styles.sectionCard}>
                <Stack gap={10}>
                  <Typography variant="h4">Наша идея</Typography>
                  <Typography variant="bodyS" className={styles.mutedText}>
                    Объединить каталог, статьи и персональный профиль в одну систему, где всё связано едиными
                    контрактами и понятной навигацией.
                  </Typography>
                </Stack>
              </Card>
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <div className={styles.sectionHeader}>
              <Typography variant="meta">Возможности</Typography>
              <Typography variant="h2">Что уже есть в продукте</Typography>
            </div>
            <div className={styles.featureGrid}>
              {productFeatures.map((feature) => (
                <Card key={feature.title} className={styles.featureCard}>
                  <Stack gap={10}>
                    <Typography variant="h5">{feature.title}</Typography>
                    <Typography variant="bodyS" className={styles.mutedText}>
                      {feature.description}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <div className={styles.sectionHeader}>
              <Typography variant="meta">Контент-процесс</Typography>
              <Typography variant="h2">Как мы работаем с материалами</Typography>
            </div>
            <ol className={styles.flowList}>
              {contentWorkflow.map((step, index) => (
                <li key={step.title} className={styles.flowItem}>
                  <span className={styles.flowIndex}>{index + 1}</span>
                  <div>
                    <Typography variant="h5">{step.title}</Typography>
                    <Typography variant="bodyS" className={styles.mutedText}>
                      {step.description}
                    </Typography>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <Card className={styles.safetyCard}>
              <Stack gap={10}>
                <Typography variant="meta">Безопасность</Typography>
                <Typography variant="h3">Fungi не заменяет очную экспертизу</Typography>
                <Typography variant="bodyS" className={styles.safetyText}>
                  Если есть сомнения в идентификации гриба, не используйте его в пищу. Приложение помогает
                  структурировать информацию, но не является медицинским или экспертно-криминалистическим заключением.
                </Typography>
              </Stack>
            </Card>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <div className={styles.sectionHeader}>
              <Typography variant="meta">Команда</Typography>
              <Typography variant="h2">Как мы работаем для вас</Typography>
            </div>
            <div className={styles.teamGrid}>
              {teamMembers.map((member) => (
                <Card key={member.title} className={styles.teamCard}>
                  <Stack gap={8}>
                    <Typography variant="h5">{member.title}</Typography>
                    <Typography variant="bodyS" className={styles.mutedText}>
                      {member.description}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <div className={styles.sectionHeader}>
              <Typography variant="meta">Принципы</Typography>
              <Typography variant="h2">Ценности проекта</Typography>
            </div>
            <ul className={styles.valueList}>
              {values.map((value) => (
                <li key={value} className={styles.valueChip}>
                  <Typography variant="bodyS">{value}</Typography>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <div className={styles.sectionHeader}>
              <Typography variant="meta">Roadmap</Typography>
              <Typography variant="h2">Ближайший план развития</Typography>
            </div>
            <div className={styles.roadmapGrid}>
              {roadmap.map((item) => (
                <Card key={item.title} className={styles.roadmapCard}>
                  <Stack gap={10}>
                    <span className={`${styles.statusBadge} ${statusClassByLabel[item.status] ?? styles.statusNext}`}>
                      {item.status}
                    </span>
                    <Typography variant="h5">{item.title}</Typography>
                    <Typography variant="bodyS" className={styles.mutedText}>
                      {item.description}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container size="lg">
            <div className={styles.contactsGrid}>
              <Card className={styles.sectionCard}>
                <Stack gap={10}>
                  <Typography variant="h4">Связаться с командой</Typography>
                  <Typography variant="bodyS" className={styles.mutedText}>
                    Если заметили неточность или хотите предложить улучшение, напишите нам.
                  </Typography>
                  <a href="mailto:team@fungi.app" className={styles.emailLink}>
                    team@fungi.app
                  </a>
                </Stack>
              </Card>
              <Card className={styles.finalCtaCard}>
                <Stack gap={10}>
                  <Typography variant="h4" className={styles.finalCtaTitle}>
                    Готовы начать?
                  </Typography>
                  <Typography variant="bodyS" className={styles.mutedTextOnDark}>
                    Посмотрите каталог и статьи, а затем соберите свой профиль с избранным и историей просмотров.
                  </Typography>
                  <div className={styles.heroActions}>
                    <Link to="/#mushrooms" className={styles.primaryLink}>
                      Открыть каталог
                    </Link>
                    <Link to="/register" className={styles.secondaryLinkInverted}>
                      Создать аккаунт
                    </Link>
                  </div>
                </Stack>
              </Card>
            </div>
          </Container>
        </section>
      </div>
    </PageLayout>
  );
}
