# Морской бой. Шарипов Руслан.

Данная программа представляет собой небольшое SPA, без хранилища данных и роутинга. Согласно описанию задачи для себя главной целью поставил интересность игры. Для этого продумал игровой мир, в контексте которого будет происходить игра, и от этого отталкивался при создании интерфейса. Я осознанно не стал делать версию для экранов с маленьким разрешением для экономии времени. В игре использована растровая графика, чего просили избежать, но мною было принято решение, что всё же я хочу сделать игру примерно такой, какая она есть сейчас, для этого графика всё же мне понадобилась.

## Релиз лист
- **28.08.18** Выпущена первая версия игры. Поиграть можно [здесь](http://btl.whtrbbt.com/)


## Интерфейс программы.
Интерфейс состоит из следующих частей.
  - Главный экран.
  - Экран выбора фракции и персонажей.
  - Экран с игровыми полями.
  - Экран для вывода результатов игры.

**Главный экран** не представляет ничего интересного, на нём находится кнопка для начала новой игры. Изначально предполагась что пользователь будет вводить туда своё имя, но от этой идеи пришлось отказаться в угоду времени. В будущих релизах данную возможность я добавлю.

**Экран выбора фракции и персонажей**. В данной части игры пользователю предлагают выбрать фракцию: "Пираты Карибского моря" и "Ост-Индская торговая компания". Каждая фракция предполагает выбор персонажа. Компьютер выбирает противоположенную сторону и одного из персонажей рандомно. Изначально предполагалось что каждый из персонажей будет обладать своим набором фраз, но от этой идеи пришлось отказаться в угоду времени. В будущих релизах это будет добавлено.

**Экран с игровыми полями**. В данной части игры представлены:
- Игровые поля пользователя и компьютера, которые уже сгенерированы рандомно.
- Персонажи и фракции обоих игроков, которые были выбраны/сгенерированы на предыдущем этапе.
- Кнопка для перетасовки кораблей и начала боя.

Кнопка **"Изменить расстановку"** - заново генерирует расстановку кораблей пользователя в рандомном порядке, за этим процессом сразу же наглядно можно наблюдать.
Кнопка **"Начать битву"** - запускает процесс игры. В начале случайным образом определяется первый ход, который остаётся за компьютером или человеком. Также генерируются стартовые реплики, которыми обмениваются персонажи в начале и по ходу всей игры. После нажатия данной кнопки скрываются кнопки **"Изменить расстановку"** и **"Начать битву"**, появляется кнопка **"Признать поражение"**, которая даёт возможность покинуть данную битву. 

**Экран для вывода результатов игры**. Данный экран появляется после выигрышного исхода одной из сторон или выхода пользователем из боя. Здесь описан результат игры и выведена краткая статистика по последнему бою. Также данный экран содержит в себе кнопки для возврата в главное меню или возможности сыграть заново. 
При выходе в главное меню пользователю придётся ещё раз пройти этап выбора фракции и персонажа. Я осознанно убрал результаты предыдущего выбора пользователя. При нажатии на кнопку **Сыграть ещё раз** пользователь минует этап выбора фракции и персонажей. 

## Технологии
- Для создания html разметки был использован шаблонизатор **Pug**.
- Для наисании таблицы стилей использован препроцессор **Sass**.
- Код программы написан на языке JavaScript с помощью  фреймворка **Vue.js**. Использовал его я впервые, так как хотел попробовать свои силы и применить полученные знания после просмотра вебинара и чтения документации.
- Все файлы собраны с помощью менеджера задач **Gulp**. Сборка честно признаться не моя, своя устарела, так что в какой-то мере тоже приходилось приноравливаться.
