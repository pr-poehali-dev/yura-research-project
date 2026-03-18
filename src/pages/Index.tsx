import { useState } from "react";
import Icon from "@/components/ui/icon";

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  section: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Оформить титульный лист", description: "Заполнить все обязательные поля: учебное заведение, дисциплина, тема, ФИО, группа, руководитель", status: "done", priority: "high", assignee: "Иванов И.И.", dueDate: "2026-03-10", section: "Оформление" },
  { id: 2, title: "Написать ВВЕДЕНИЕ", description: "Актуальность темы, цель и задачи исследования, объект и предмет, методы", status: "done", priority: "high", assignee: "Иванов И.И.", dueDate: "2026-03-12", section: "Основная часть" },
  { id: 3, title: "Глава 1 — Теоретическая часть", description: "Обзор литературы. Понятие, виды, причины, последствия. Не менее 5 источников со ссылками", status: "in_progress", priority: "high", assignee: "Иванов И.И.", dueDate: "2026-03-20", section: "Основная часть" },
  { id: 4, title: "Глава 2 — Практическая часть", description: "Анкетирование, графики и выводы. Описание методологии и результаты", status: "in_progress", priority: "medium", assignee: "Иванов И.И.", dueDate: "2026-03-25", section: "Основная часть" },
  { id: 5, title: "Написать ЗАКЛЮЧЕНИЕ", description: "Выводы по каждой главе, достижение цели и задач работы", status: "todo", priority: "medium", assignee: "Иванов И.И.", dueDate: "2026-04-01", section: "Основная часть" },
  { id: 6, title: "Оформить список источников", description: "ГОСТ оформление. Не менее 5 источников. Все ссылки в тексте должны соответствовать списку", status: "todo", priority: "high", assignee: "Иванов И.И.", dueDate: "2026-04-03", section: "Оформление" },
  { id: 7, title: "Приложения (при наличии)", description: "Графики, схемы, таблицы — до 10 страниц. Каждое приложение с новой страницы", status: "todo", priority: "low", assignee: "Иванов И.И.", dueDate: "2026-04-05", section: "Оформление" },
  { id: 8, title: "Проверка уникальности", description: "Антиплагиат — минимум 70%. При заимствованиях обязательны ссылки на источники", status: "todo", priority: "high", assignee: "Иванов И.И.", dueDate: "2026-04-08", section: "Проверка" },
  { id: 9, title: "Финальное форматирование", description: "TNR 14pt, интервал 1,5, поля: верх/низ 2 см, лево 3 см, право 1,5 см. Нумерация со 2-й страницы", status: "todo", priority: "high", assignee: "Иванов И.И.", dueDate: "2026-04-10", section: "Оформление" },
];

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  todo:        { label: "К выполнению", color: "bg-gray-100 text-gray-600" },
  in_progress: { label: "В работе",     color: "bg-blue-50 text-blue-700" },
  review:      { label: "На проверке",  color: "bg-amber-50 text-amber-700" },
  done:        { label: "Готово",       color: "bg-emerald-50 text-emerald-700" },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low:    { label: "Низкий",  color: "text-gray-400" },
  medium: { label: "Средний", color: "text-amber-500" },
  high:   { label: "Высокий", color: "text-red-500" },
};

const NAV_ITEMS = [
  { id: "tasks",    label: "Задачи",         icon: "CheckSquare" },
  { id: "title",    label: "Титульный лист", icon: "FileText" },
  { id: "contents", label: "Оглавление",     icon: "List" },
  { id: "writing",  label: "Написание",      icon: "PenLine" },
  { id: "docs",     label: "Требования",     icon: "BookOpen" },
];

// ── Клише ───────────────────────────────────────────────────────────────────
const THEORY_CLICHES = [
  { group: "Определения и понятия", items: [
    "Ключевые понятия для нашего исследования – это …",
    "… называется …",
    "На официальном сайте … мы нашли следующее определение термина … «…»",
    "Иванов В.В. в книге … определяет понятие … как …",
    "Петров В.В. понимает под термином …",
    "Сидоров С.С. рассматривает … как …",
    "Андреев А.А. в книге «…» дает следующее определение …",
    "Сайт … предлагает следующее определение понятия …",
  ]},
  { group: "Ссылки на источники", items: [
    "В статье Иванова «…» в журнале «…» говорится, что …",
    "Из книги … мы узнали, что …",
    "Как пишет Иванов И.И. в статье «…», …",
    "По мнению Иванова В.В. …",
    "История вопроса подробно освещена на страницах современных энциклопедий, например …, а также на сайте …",
  ]},
  { group: "Логические связки", items: [
    "Принято считать, что …",
    "Общеизвестным считается …",
    "Вначале обратимся к истории вопроса …",
    "Впервые …",
    "Возможно, это связано …",
    "Кроме того, …",
    "Интересно, что …",
    "Распространённым является мнение, что …",
    "При этом необходимо подчеркнуть, что …",
  ]},
];

const SURVEY_CLICHES = [
  { group: "Описание опроса", items: [
    "Для того, чтобы выяснить … мы решили провести опрос … среди студентов … группы / преподавателей.",
    "Опрос проводился посредством анкетирования / опроса в социальных сетях.",
    "В опросе приняли участие … студентов и … преподавателей.",
    "Респондентам были заданы следующие вопросы: …",
    "Исследование проводилось на материале …",
    "В качестве материала для исследования были взяты …",
    "Источником примеров стали …",
  ]},
  { group: "Анализ результатов", items: [
    "Затем я обработал(а) анкеты и получил(а) следующие результаты.",
    "На вопрос: «…» … % опрошенных ответили положительно.",
    "На вопрос: «…» … % опрошенных ответили «да» / «нет».",
    "Таким образом, из … представленных … опрошенные правильно смогли только …",
    "Остальные … либо не смогли …, либо …",
    "Результаты анкетирования показали, что …",
    "Проведённое исследование позволяет сделать вывод о том, что …",
  ]},
];

const RESULTS_CLICHES = [
  { group: "Описание таблиц и иллюстраций", items: [
    "Результаты анкетирования представлены в таблице 1.",
    "На диаграмме 2 вы можете видеть …",
    "На рисунке 3 представлены …",
    "Диаграмма показывает …",
    "Как видно из таблицы …",
    "По результатам анализа (см. таблицу) видно, что …",
    "Данные анализа (табл. 5) показывают, что …",
  ]},
  { group: "Описание иллюстративного материала", items: [
    "В данном случае мы видим … / имеем дело с …",
    "При этом нельзя не отметить …",
    "Обращает на себя внимание тот факт, что …",
    "Как видно из графика, …",
    "Схема наглядно демонстрирует …",
  ]},
];

const CONCLUSIONS_CLICHES = [
  { group: "Формулировка выводов", items: [
    "На основании всего вышесказанного мы можем констатировать …",
    "Все вышесказанное дает нам возможность сделать следующие выводы: …",
    "Таким образом, мы видим …",
    "Следовательно …",
    "Очевидно, что …",
    "Из вышесказанного следует, что …",
    "Подводя итоги вышесказанному, необходимо отметить следующее …",
    "Подводя итоги главе 2, необходимо подчеркнуть …",
    "Подводя промежуточные итоги, мы можем сказать, что …",
  ]},
  { group: "Итоги исследования", items: [
    "В результате проведённого исследования мы выяснили, что …",
    "Проведённое исследование позволило нам сделать следующие выводы …",
    "Главный вывод, который я сделал: …",
    "В ходе проведённого исследования было выявлено / установлено, что …",
    "Таким образом, мы убедились …",
    "Все вышесказанное доказывает, что …",
    "Все вышесказанное убеждает нас в том, что …",
    "Найденные и проанализированные нами примеры позволяют выявить следующую закономерность: …",
    "Наиболее правдоподобной нам кажется версия …, потому что …",
  ]},
];

const CONCLUSION_SECTION_CLICHES = [
  { group: "Подведение итогов", items: [
    "Цель исследования достигнута, задачи решены.",
    "Полученные результаты позволили подтвердить / опровергнуть гипотезу.",
    "На основании вышесказанного логично предположить, что …",
  ]},
  { group: "Перспективы дальнейшего исследования", items: [
    "Перспективы дальнейшего исследования проблемы мы видим в более подробном / детальном изучении …",
    "В перспективе было бы интересно …",
    "На наш взгляд, было бы интересно изучить / исследовать / рассмотреть …",
    "Кроме …, рассмотренных в данной работе, по нашему мнению, было бы интересно изучить …",
    "Работа рассматривает лишь один из аспектов проблемы. Исследования в этом направлении могут быть продолжены. Это могло бы быть изучение не только … но и …",
  ]},
  { group: "Назначение и значимость работы", items: [
    "Исследование может быть полезно и интересно студентам, которые увлекаются …, а также всем, кто интересуется …",
    "Результаты нашего исследования могли бы помочь в …",
    "Работа может представлять интерес для …",
    "Результаты исследования могут быть использованы преподавателями при подготовке уроков / конкурсов / викторин по теме …",
    "Своей работой я хотел привлечь внимание одногруппников к проблеме …",
    "Практическая значимость исследования заключается в том, что его результаты легли в основу разработанных мной правил … / памятки по … для …",
  ]},
  { group: "Что дала работа исследователю", items: [
    "В процессе написания работы я узнал / научился / открыл для себя / выяснил …",
    "Работа помогла мне понять / осознать / решить проблему / по-новому взглянуть …",
    "В процессе работы над исследованием я приобрел опыт …",
    "Думаю, что полученные мной знания позволят мне избежать ошибок / помогут правильно …",
    "Результаты исследования заставили меня задуматься …",
    "Больше всего сложностей вызвало у меня …",
    "Исследование в корне изменило моё мнение / представление о …",
  ]},
];

// ── Оглавление ──────────────────────────────────────────────────────────────
interface TocEntry {
  id: string;
  level: "heading" | "chapter" | "sub" | "appendix";
  label: string;
  page: number;
}

const INITIAL_TOC: TocEntry[] = [
  { id: "intro",    level: "heading",  label: "ВВЕДЕНИЕ",                        page: 3 },
  { id: "ch1",      level: "chapter",  label: "ГЛАВА 1 ТЕОРЕТИЧЕСКАЯ ЧАСТЬ",     page: 4 },
  { id: "1-1",      level: "sub",      label: "1.1 Понятие безработицы",          page: 4 },
  { id: "1-2",      level: "sub",      label: "1.2 Виды безработицы",             page: 4 },
  { id: "1-3",      level: "sub",      label: "1.3 Причины безработицы",          page: 9 },
  { id: "1-4",      level: "sub",      label: "1.4 Последствия безработицы",      page: 11 },
  { id: "ch2",      level: "chapter",  label: "ГЛАВА 2 ПРАКТИЧЕСКАЯ ЧАСТЬ",      page: 13 },
  { id: "2-1",      level: "sub",      label: "2.1 Анкетирование",               page: 13 },
  { id: "2-2",      level: "sub",      label: "2.2 Графики и выводы",            page: 13 },
  { id: "outro",    level: "heading",  label: "ЗАКЛЮЧЕНИЕ",                       page: 19 },
  { id: "sources",  level: "heading",  label: "СПИСОК ИСПОЛЬЗОВАННЫХ ИСТОЧНИКОВ", page: 20 },
  { id: "append",   level: "appendix", label: "ПРИЛОЖЕНИЯ (если есть)",           page: 21 },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterSection, setFilterSection] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "", description: "", assignee: "Иванов И.И.", dueDate: "",
    priority: "medium" as TaskPriority, section: "Основная часть", status: "todo" as TaskStatus,
  });

  // Writing helpers
  const [writingTab, setWritingTab] = useState<"theory" | "survey" | "results" | "conclusions" | "conclusion_section">("theory");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const copyCliché = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  // TOC state
  const [toc, setToc] = useState<TocEntry[]>(INITIAL_TOC);
  const [editingToc, setEditingToc] = useState(false);
  const [editToc, setEditToc] = useState<TocEntry[]>([]);

  // Title page state
  const [titleData, setTitleData] = useState({
    student: "Иванов Иван Иванович",
    group: "А–11",
    specialty: "35.02.05 Агрономия",
    topic: "«ТЕМА»",
    discipline: "обществознанию",
    supervisor: "Полторацкая Л. А.",
    city: "Ейск",
    year: "2026",
    projectType: "ИНДИВИДУАЛЬНЫЙ ПРОЕКТ",
  });
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState({ ...titleData });

  const sections = ["all", ...Array.from(new Set(tasks.map(t => t.section)))];
  const filteredTasks = tasks.filter(t =>
    (filterStatus === "all" || t.status === filterStatus) &&
    (filterSection === "all" || t.section === filterSection)
  );

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "done").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
  };
  const progress = Math.round((stats.done / stats.total) * 100);

  const updateTaskStatus = (id: number, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelectedTask(prev => prev?.id === id ? { ...prev, status } : prev);
  };
  const deleteTask = (id: number) => { setTasks(prev => prev.filter(t => t.id !== id)); setSelectedTask(null); };
  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks(prev => [...prev, { ...newTask, id: Date.now() }]);
    setShowAddModal(false);
    setNewTask({ title: "", description: "", assignee: "Иванов И.И.", dueDate: "", priority: "medium", section: "Основная часть", status: "todo" });
  };

  const startEditToc = () => { setEditToc(toc.map(e => ({ ...e }))); setEditingToc(true); };
  const saveToc = () => { setToc(editToc); setEditingToc(false); };

  return (
    <div className="min-h-screen bg-[#F7F7F6]" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
              <Icon name="Layers" size={13} className="text-white" />
            </div>
            <span className="font-semibold text-[14px] tracking-tight text-gray-900">ПроектLab</span>
            <span className="hidden sm:inline text-[11px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 ml-1">
              Агрономия · А–11
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  activeTab === item.id ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon name={item.icon} size={13} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-600">
            ИИ
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-5 py-8">

        {/* ═══ ЗАДАЧИ ═══════════════════════════════════════════════════════ */}
        {activeTab === "tasks" && (
          <div className="animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
              {[
                { label: "Всего задач",  value: stats.total,       icon: "List",         color: "text-gray-700" },
                { label: "Готово",       value: stats.done,        icon: "CheckCircle2", color: "text-emerald-600" },
                { label: "В работе",     value: stats.inProgress,  icon: "Clock",        color: "text-blue-600" },
                { label: "Прогресс",     value: `${progress}%`,    icon: "TrendingUp",   color: "text-violet-600" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-slide-up" style={{ animationDelay: `${i * 55}ms` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-400 font-medium">{s.label}</span>
                    <Icon name={s.icon} size={13} className={s.color} />
                  </div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  {s.label === "Прогресс" && (
                    <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1">
                {(["all", "todo", "in_progress", "review", "done"] as const).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${filterStatus === s ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}>
                    {s === "all" ? "Все" : STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-white border border-gray-100 rounded-lg p-1">
                {sections.map(s => (
                  <button key={s} onClick={() => setFilterSection(s)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${filterSection === s ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}>
                    {s === "all" ? "Все разделы" : s}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAddModal(true)}
                className="ml-auto flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-700 transition-colors">
                <Icon name="Plus" size={13} />
                Добавить задачу
              </button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredTasks.length === 0 && (
                <div className="text-center py-14 text-gray-400 text-sm">Нет задач по выбранным фильтрам</div>
              )}
              {filteredTasks.map((task, i) => (
                <div key={task.id} onClick={() => setSelectedTask(task)}
                  className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-start gap-3 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all animate-slide-up"
                  style={{ animationDelay: `${i * 35}ms` }}>
                  <button onClick={e => { e.stopPropagation(); updateTaskStatus(task.id, task.status === "done" ? "todo" : "done"); }}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      task.status === "done" ? "bg-emerald-500 border-emerald-500" : "border-gray-300 hover:border-gray-500"
                    }`}>
                    {task.status === "done" && <Icon name="Check" size={10} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className={`text-[13px] font-medium leading-snug ${task.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold ${PRIORITY_CONFIG[task.priority].color}`}>
                          ↑ {PRIORITY_CONFIG[task.priority].label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[task.status].color}`}>
                          {STATUS_CONFIG[task.status].label}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Icon name="User" size={10} />{task.assignee}</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Icon name="Calendar" size={10} />{task.dueDate}</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Icon name="Tag" size={10} />{task.section}</span>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={13} className="text-gray-300 mt-1 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ТИТУЛЬНЫЙ ЛИСТ ═══════════════════════════════════════════════ */}
        {activeTab === "title" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-gray-900">Титульный лист</h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 border border-gray-200 rounded px-2 py-0.5">Страница 1 (не нумеруется)</span>
                {!editingTitle ? (
                  <button onClick={() => { setEditTitle({ ...titleData }); setEditingTitle(true); }}
                    className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    <Icon name="Pencil" size={12} />
                    Редактировать
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditingTitle(false)}
                      className="text-[12px] text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                      Отмена
                    </button>
                    <button onClick={() => { setTitleData({ ...editTitle }); setEditingTitle(false); }}
                      className="flex items-center gap-1.5 text-[12px] bg-gray-900 text-white rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors">
                      <Icon name="Check" size={12} />
                      Сохранить
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row">
              {/* Edit panel */}
              {editingTitle && (
                <div className="lg:w-72 flex-shrink-0 animate-fade-in">
                  <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4 sticky top-20">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Данные студента</p>
                    {[
                      { label: "ФИО студента",     key: "student" },
                      { label: "Группа",            key: "group" },
                      { label: "Специальность",     key: "specialty" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[11px] text-gray-400 mb-1 block">{f.label}</label>
                        <input
                          value={editTitle[f.key as keyof typeof editTitle]}
                          onChange={e => setEditTitle(p => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-gray-400 transition-colors"
                        />
                      </div>
                    ))}

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Проект</p>
                      {[
                        { label: "Тема проекта",     key: "topic" },
                        { label: "Тип работы",        key: "projectType" },
                        { label: "Дисциплина (по ...)", key: "discipline" },
                      ].map(f => (
                        <div key={f.key} className="mb-3">
                          <label className="text-[11px] text-gray-400 mb-1 block">{f.label}</label>
                          <input
                            value={editTitle[f.key as keyof typeof editTitle]}
                            onChange={e => setEditTitle(p => ({ ...p, [f.key]: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-gray-400 transition-colors"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Руководитель и место</p>
                      {[
                        { label: "ФИО руководителя", key: "supervisor" },
                        { label: "Город",             key: "city" },
                        { label: "Год",               key: "year" },
                      ].map(f => (
                        <div key={f.key} className="mb-3">
                          <label className="text-[11px] text-gray-400 mb-1 block">{f.label}</label>
                          <input
                            value={editTitle[f.key as keyof typeof editTitle]}
                            onChange={e => setEditTitle(p => ({ ...p, [f.key]: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-gray-400 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* A4 Preview */}
              <div className="flex-1">
                <div
                  className="bg-white border border-gray-200 shadow-sm mx-auto"
                  style={{
                    width: "100%", maxWidth: "595px",
                    padding: "56px 42px 42px 84px",
                    fontFamily: "'Times New Roman', Georgia, serif",
                    fontSize: "14px", lineHeight: "1.5",
                  }}
                >
                  <div className="text-center mb-2" style={{ fontSize: "13px" }}>
                    <p style={{ textTransform: "uppercase" }}>Министерство образования и науки</p>
                    <p>Краснодарского края</p>
                    <p>Государственное бюджетное профессиональное</p>
                    <p>образовательное учреждение Краснодарского края</p>
                    <p>«Ейский полипрофильный колледж»</p>
                    <p>(ГБПОУ КК ЕПК)</p>
                  </div>

                  <div className="text-center mt-1 mb-3" style={{ fontSize: "13px" }}>
                    <p>Отделение Сельского хозяйства и строительных технологий</p>
                    <p>Специальность {editingTitle ? editTitle.specialty : titleData.specialty}</p>
                  </div>

                  <div className="flex justify-end mb-6" style={{ fontSize: "13px" }}>
                    <div>
                      <p>Студент {editingTitle ? editTitle.group : titleData.group} группы</p>
                      <div style={{ borderBottom: "1px solid #999", width: "220px", margin: "18px 0 4px" }} />
                      <p>{editingTitle ? editTitle.student : titleData.student}</p>
                    </div>
                  </div>

                  <div className="text-center mb-2" style={{ fontWeight: "bold", fontSize: "14px" }}>
                    <p>{editingTitle ? editTitle.topic : titleData.topic}</p>
                  </div>

                  <div className="text-center mb-8" style={{ fontSize: "13px" }}>
                    <p>{editingTitle ? editTitle.projectType : titleData.projectType}</p>
                    <p>по {editingTitle ? editTitle.discipline : titleData.discipline}</p>
                  </div>

                  <div className="flex justify-end mb-16" style={{ fontSize: "13px" }}>
                    <div>
                      <p>Научный руководитель:</p>
                      <div style={{ borderBottom: "1px solid #999", width: "180px", margin: "18px 0 4px" }} />
                      <p>{editingTitle ? editTitle.supervisor : titleData.supervisor}</p>
                    </div>
                  </div>

                  <div className="text-center" style={{ fontSize: "13px" }}>
                    <p>{editingTitle ? editTitle.city : titleData.city}, {editingTitle ? editTitle.year : titleData.year} г.</p>
                  </div>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 flex gap-2.5" style={{ maxWidth: "595px" }}>
                  <Icon name="Info" size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-amber-700 leading-relaxed">
                    Титульный лист — страница №1, но <strong>не нумеруется</strong>. Поля: левое 3 см, правое 1,5 см, верх/низ 2 см.
                    Все сокращения (ГБПОУ КК ЕПК и др.) должны быть расшифрованы в тексте работы.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ОГЛАВЛЕНИЕ ═══════════════════════════════════════════════════ */}
        {activeTab === "contents" && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-gray-900">Оглавление</h2>
              {!editingToc ? (
                <button onClick={startEditToc}
                  className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <Icon name="Pencil" size={12} />
                  Редактировать
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditingToc(false)}
                    className="text-[12px] text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    Отмена
                  </button>
                  <button onClick={saveToc}
                    className="flex items-center gap-1.5 text-[12px] bg-gray-900 text-white rounded-lg px-3 py-1.5 hover:bg-gray-700 transition-colors">
                    <Icon name="Check" size={12} />
                    Сохранить
                  </button>
                </div>
              )}
            </div>

            {/* A4 preview */}
            <div
              className="bg-white border border-gray-200 shadow-sm mx-auto"
              style={{ width: "100%", maxWidth: "595px", padding: "56px 42px 56px 84px", fontFamily: "'Times New Roman', Georgia, serif" }}
            >
              <p className="text-center font-bold mb-6" style={{ fontSize: "14px", letterSpacing: "0.05em" }}>ОГЛАВЛЕНИЕ</p>

              {!editingToc ? (
                <div className="space-y-1">
                  {toc.map(entry => (
                    <div key={entry.id} className="flex items-baseline" style={{ fontSize: "13px" }}>
                      <span style={{
                        paddingLeft: entry.level === "sub" ? "24px" : entry.level === "appendix" ? "0" : "0",
                        fontWeight: entry.level === "chapter" || entry.level === "heading" ? "bold" : "normal",
                        flex: 1,
                      }}>
                        {entry.label}
                      </span>
                      <span className="mx-1" style={{ flex: "1", borderBottom: "1px dotted #999", minWidth: "40px", marginBottom: "3px" }} />
                      <span style={{ minWidth: "28px", textAlign: "right" }}>{entry.page}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {editToc.map((entry, i) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <select
                        value={entry.level}
                        onChange={e => setEditToc(prev => prev.map((x, j) => j === i ? { ...x, level: e.target.value as TocEntry["level"] } : x))}
                        className="text-[11px] border border-gray-200 rounded px-1.5 py-1 w-28 outline-none"
                      >
                        <option value="heading">Заголовок</option>
                        <option value="chapter">Глава</option>
                        <option value="sub">Подраздел</option>
                        <option value="appendix">Приложение</option>
                      </select>
                      <input
                        value={entry.label}
                        onChange={e => setEditToc(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                        className="flex-1 border border-gray-200 rounded px-2 py-1 text-[12px] outline-none focus:border-gray-400"
                      />
                      <input
                        type="number"
                        value={entry.page}
                        onChange={e => setEditToc(prev => prev.map((x, j) => j === i ? { ...x, page: Number(e.target.value) } : x))}
                        className="w-14 border border-gray-200 rounded px-2 py-1 text-[12px] text-center outline-none focus:border-gray-400"
                      />
                      <button onClick={() => setEditToc(prev => prev.filter((_, j) => j !== i))}
                        className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors">
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditToc(prev => [...prev, { id: `new-${Date.now()}`, level: "sub", label: "Новый раздел", page: 1 }])}
                    className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 mt-2 transition-colors">
                    <Icon name="Plus" size={11} />
                    Добавить строку
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex gap-2.5">
              <Icon name="Info" size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-blue-700 leading-relaxed">
                Слово <strong>ОГЛАВЛЕНИЕ</strong> — заглавными буквами, по центру, без точки. Главы — заглавными и жирным. Подразделы — строчными. Каждый раздел начинается с новой страницы.
              </p>
            </div>
          </div>
        )}

        {/* ═══ НАПИСАНИЕ ════════════════════════════════════════════════════ */}
        {activeTab === "writing" && (() => {
          const WRITING_TABS = [
            { id: "theory",             label: "Теория" },
            { id: "survey",             label: "Анкетирование" },
            { id: "results",            label: "Результаты" },
            { id: "conclusions",        label: "Выводы" },
            { id: "conclusion_section", label: "Заключение" },
          ] as const;

          const INFO: Record<string, { icon: string; text: React.ReactNode }> = {
            theory: { icon: "BookOpen", text: <>Теоретическая глава — <strong>5–7 страниц</strong>. Содержание должно полностью раскрывать тему и соответствовать всем пунктам оглавления. Вспомогательные материалы — в приложения.</> },
            survey: { icon: "BarChart2", text: <>Анкетирование обязательно для всех работ, кроме тех, что включают лабораторный опыт, эксперимент или создание материального объекта.</> },
            results: { icon: "PieChart", text: <>Иллюстративный материал: чертёж, схема, фотография, диаграмма, график, таблица. Если таблица одна — слово «Таблица» и заголовок не нужны. Две и более — пронумеровать и дать ссылку в тексте.</> },
            conclusions: { icon: "CheckCircle2", text: <>Выводы пишутся по каждой главе. Это не перечень — а синтез накопленного материала. Соотнесите итоги с целью и задачами, поставленными во введении.</> },
            conclusion_section: { icon: "Flag", text: <>Заключение — лаконичный синтез всей работы: итоги, соответствие цели и задачам, перспективы, практическая значимость и личный вклад автора.</> },
          };

          const CLICHE_MAP: Record<string, typeof THEORY_CLICHES> = {
            theory: THEORY_CLICHES,
            survey: SURVEY_CLICHES,
            results: RESULTS_CLICHES,
            conclusions: CONCLUSIONS_CLICHES,
            conclusion_section: CONCLUSION_SECTION_CLICHES,
          };

          const info = INFO[writingTab];
          const cliches = CLICHE_MAP[writingTab];

          return (
            <div className="animate-fade-in max-w-3xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[15px] font-semibold text-gray-900">Клише для написания</h2>
                <span className="text-[11px] text-gray-400">Нажмите — скопируется в буфер</span>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-1 bg-white border border-gray-100 rounded-lg p-1 mb-6 w-fit">
                {WRITING_TABS.map(t => (
                  <button key={t.id} onClick={() => setWritingTab(t.id)}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-all ${writingTab === t.id ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex gap-2.5 mb-5">
                <Icon name={info.icon} size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue-700 leading-relaxed">{info.text}</p>
              </div>

              {/* Clichés */}
              {cliches.map((group, gi) => (
                <div key={gi} className="mb-6">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-gray-300 inline-block" />
                    {group.group}
                  </p>
                  <div className="space-y-2">
                    {group.items.map((text, ti) => (
                      <button key={ti} onClick={() => copyCliché(text)}
                        className={`w-full text-left bg-white border rounded-xl px-4 py-3 text-[13px] leading-relaxed transition-all group flex items-start justify-between gap-3 ${
                          copiedText === text
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-gray-100 text-gray-700 hover:border-gray-300 hover:shadow-sm"
                        }`}>
                        <span>{text}</span>
                        <span className="flex-shrink-0 mt-0.5">
                          {copiedText === text
                            ? <Icon name="Check" size={13} className="text-emerald-500" />
                            : <Icon name="Copy" size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Example: survey */}
              {writingTab === "survey" && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
                    <Icon name="FileText" size={13} className="text-gray-400" />
                    <span className="text-[12px] font-semibold text-gray-600">Пример оформления результатов анкетирования</span>
                  </div>
                  <div className="p-4 bg-white text-[12px] text-gray-600 leading-relaxed space-y-2" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
                    <p className="font-bold text-gray-800">Анкетирование и его результаты</p>
                    <p>В рамках работы было опрошено <strong>70 студентов</strong>, 30 (43%) девушек и 40 (57%) юношей в возрасте от 16 до 21 года.</p>
                    <p>На вопрос: «Посещали ли вы рестораны быстрого питания?» <strong>82% опрошенных</strong> ответили положительно.</p>
                    <p>Таким образом, из 12 представленных названий блюд опрошенные правильно перевести смогли только <strong>50% слов</strong>.</p>
                  </div>
                </div>
              )}

              {/* Example: results */}
              {writingTab === "results" && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
                    <Icon name="Table" size={13} className="text-gray-400" />
                    <span className="text-[12px] font-semibold text-gray-600">Правила оформления таблиц</span>
                  </div>
                  <div className="p-4 bg-white text-[12px] text-gray-600 leading-relaxed space-y-1.5">
                    <p>📌 <strong>Одна таблица</strong> — слово «Таблица» и заголовок не нужны. Ссылка: «Как видно из таблицы…»</p>
                    <p>📌 <strong>Две и более</strong> — нумеруются, каждая имеет ссылку в тексте: «(табл. 5)»</p>
                    <p>📌 При переносе на след. страницу — пишут «продолжение таблицы 5», заголовок не повторяют</p>
                    <p>📌 На графиках и диаграммах обязательны: единицы измерения, числовые данные, пояснения</p>
                  </div>
                </div>
              )}

              {/* Example: conclusion section */}
              {writingTab === "conclusion_section" && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
                    <Icon name="Info" size={13} className="text-gray-400" />
                    <span className="text-[12px] font-semibold text-gray-600">Структура раздела ЗАКЛЮЧЕНИЕ</span>
                  </div>
                  <div className="p-4 bg-white text-[12px] text-gray-600 leading-relaxed space-y-1.5">
                    <p>1. <strong>Итоги:</strong> были ли достигнуты цель и задачи, подтверждена ли гипотеза</p>
                    <p>2. <strong>Перспективы:</strong> что можно изучить в продолжение темы</p>
                    <p>3. <strong>Назначение:</strong> кому и как может быть полезна работа</p>
                    <p>4. <strong>Личный вклад:</strong> что дало исследование самому автору</p>
                  </div>
                </div>
              )}
            </div>
          );
        })()}


        {/* ═══ ТРЕБОВАНИЯ ═══════════════════════════════════════════════════ */}
        {activeTab === "docs" && (
          <div className="animate-fade-in max-w-3xl">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-5">Требования к оформлению</h2>
            <div className="space-y-2.5">
              {[
                { icon: "Type",         title: "Шрифт и размер",         text: "Times New Roman, 14 пунктов, межстрочный интервал 1,5, выравнивание по ширине" },
                { icon: "Layout",       title: "Поля страницы",          text: "Верхнее и нижнее — 2 см, левое — 3 см, правое — 1,5 см" },
                { icon: "FileText",     title: "Объём работы",           text: "От 5 до 15 страниц основного текста + до 10 страниц приложений" },
                { icon: "Hash",         title: "Нумерация страниц",      text: "Титульный лист — страница №1, но не нумеруется. Нумерация начинается со 2-й страницы (оглавление)" },
                { icon: "AlignJustify", title: "Заголовки разделов",     text: "Печатаются ЗАГЛАВНЫМИ буквами, точка в конце не ставится. Каждый раздел — с новой страницы" },
                { icon: "Link",         title: "Цитирование и плагиат",  text: "Все заимствования — обязательно со ссылкой. Плагиат без ссылок — к защите не допускается" },
                { icon: "Search",       title: "Сокращения",             text: "Все сокращения (в т.ч. ГБПОУ КК ЕПК) должны быть расшифрованы при первом упоминании" },
                { icon: "BookMarked",   title: "Список источников",      text: "Оформляется по ГОСТ. Каждый источник в тексте должен иметь ссылку" },
              ].map((r, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl px-5 py-3.5 flex gap-3.5 items-start animate-slide-up" style={{ animationDelay: `${i * 45}ms` }}>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon name={r.icon} size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{r.title}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Task Detail Modal ─────────────────────────────────────────────── */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedTask(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${STATUS_CONFIG[selectedTask.status].color}`}>
                {STATUS_CONFIG[selectedTask.status].label}
              </span>
              <button onClick={() => setSelectedTask(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Icon name="X" size={12} />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-2">{selectedTask.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed mb-5">{selectedTask.description}</p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  { label: "Исполнитель", value: selectedTask.assignee, icon: "User" },
                  { label: "Срок",        value: selectedTask.dueDate,  icon: "Calendar" },
                  { label: "Раздел",      value: selectedTask.section,  icon: "Tag" },
                  { label: "Приоритет",   value: PRIORITY_CONFIG[selectedTask.priority].label, icon: "Flag" },
                ].map((f, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{f.label}</p>
                    <p className="text-[12px] font-medium text-gray-800">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                {(["todo", "in_progress", "review", "done"] as TaskStatus[]).map(s => (
                  <button key={s} onClick={() => updateTaskStatus(selectedTask.id, s)}
                    className={`flex-1 py-1.5 text-[11px] rounded-lg font-medium transition-all ${
                      selectedTask.status === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}>
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => deleteTask(selectedTask.id)}
                className="w-full py-2 text-[12px] text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium">
                Удалить задачу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Task Modal ────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-900">Новая задача</h3>
              <button onClick={() => setShowAddModal(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Icon name="X" size={12} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <input placeholder="Название задачи *" value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-gray-400 transition-colors" />
              <textarea placeholder="Описание" value={newTask.description} rows={3}
                onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-gray-400 transition-colors resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Исполнитель" value={newTask.assignee}
                  onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-gray-400" />
                <input type="date" value={newTask.dueDate}
                  onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-gray-400" />
                <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value as TaskPriority }))}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-gray-400">
                  <option value="low">Низкий приоритет</option>
                  <option value="medium">Средний приоритет</option>
                  <option value="high">Высокий приоритет</option>
                </select>
                <select value={newTask.section} onChange={e => setNewTask(p => ({ ...p, section: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-gray-400">
                  <option>Оформление</option>
                  <option>Основная часть</option>
                  <option>Проверка</option>
                </select>
              </div>
              <button onClick={addTask} disabled={!newTask.title.trim()}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-[13px] font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Создать задачу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}