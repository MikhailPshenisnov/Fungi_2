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

# Показать все удаленные ветки (должна быть origin/mobile)
git branch -r

# Загрузить удалённую ветку к себе локально и перейти на нее
git checkout mobile
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
