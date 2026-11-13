export interface Word {
  id: string;
  word: string;
  pos: string;
  uz: string;
  def: string;
  example: string;
  topic: string;
}

const w = (id: string, word: string, pos: string, uz: string, def: string, example: string, topic: string): Word => ({ id, word, pos, uz, def, example, topic });

export const vocab: Word[] = [
  // Environment
  w('sustainable', 'sustainable', 'adj', 'barqaror (tabiatga zarar yetkazmaydigan)', 'able to continue without harming the environment', 'Solar power is a sustainable source of energy.', 'Environment'),
  w('pollution', 'pollution', 'n', 'ifloslanish', 'harmful substances in the air, water or soil', 'Air pollution is a serious problem in big cities.', 'Environment'),
  w('deforestation', 'deforestation', 'n', 'o‘rmonlarning kesilishi', 'the cutting down of large areas of forest', 'Deforestation destroys the homes of many animals.', 'Environment'),
  w('renewable', 'renewable', 'adj', 'qayta tiklanadigan', 'able to be replaced naturally', 'Wind is a renewable resource.', 'Environment'),
  w('emission', 'emission', 'n', 'zararli gaz chiqindisi', 'a gas or other substance released into the air', 'Cars produce carbon emissions.', 'Environment'),
  w('conserve', 'conserve', 'v', 'tejab asramoq', 'to protect something and use it carefully', 'We should conserve water in summer.', 'Environment'),
  w('habitat', 'habitat', 'n', 'yashash muhiti', 'the natural home of an animal or plant', 'Wetlands are a habitat for many birds.', 'Environment'),
  w('climate', 'climate', 'n', 'iqlim', 'the usual weather conditions of an area', 'The climate is dry and hot in summer.', 'Environment'),
  w('drought', 'drought', 'n', 'qurg‘oqchilik', 'a long period with very little rain', 'The drought damaged the cotton harvest.', 'Environment'),
  w('recycle', 'recycle', 'v', 'qayta ishlamoq', 'to treat used material so it can be used again', 'Many people recycle plastic bottles.', 'Environment'),
  // Education
  w('curriculum', 'curriculum', 'n', 'o‘quv dasturi', 'the subjects taught in a school or course', 'The curriculum includes science and art.', 'Education'),
  w('tuition', 'tuition', 'n', 'o‘qish to‘lovi', 'money paid for teaching', 'Tuition fees are high at some universities.', 'Education'),
  w('scholarship', 'scholarship', 'n', 'stipendiya (grant)', 'money given to a student to pay for their study', 'She won a scholarship to study in London.', 'Education'),
  w('literacy', 'literacy', 'n', 'savodxonlik', 'the ability to read and write', 'The government wants to improve adult literacy.', 'Education'),
  w('compulsory', 'compulsory', 'adj', 'majburiy', 'required by law or by rules', 'Primary education is compulsory.', 'Education'),
  w('graduate', 'graduate', 'v', 'universitetni bitirmoq', 'to complete a university degree', 'He graduated in economics last year.', 'Education'),
  w('assignment', 'assignment', 'n', 'topshiriq', 'a piece of work given to a student', 'The assignment is due on Friday.', 'Education'),
  w('enrol', 'enrol', 'v', 'o‘qishga yozilmoq', 'to officially join a course or school', 'She enrolled in an evening course.', 'Education'),
  w('lecture', 'lecture', 'n', 'ma‘ruza', 'a talk given to students about a subject', 'The lecture lasted two hours.', 'Education'),
  w('dissertation', 'dissertation', 'n', 'dissertatsiya', 'a long piece of writing for a university degree', 'He spent a year on his dissertation.', 'Education'),
  // Technology
  w('innovation', 'innovation', 'n', 'yangilik, innovatsiya', 'a new idea, method or invention', 'Innovation drives economic growth.', 'Technology'),
  w('device', 'device', 'n', 'qurilma', 'a machine or tool made for a purpose', 'Smartphones are popular devices.', 'Technology'),
  w('automate', 'automate', 'v', 'avtomatlashtirmoq', 'to make a process work without people', 'Factories automate many tasks.', 'Technology'),
  w('digital', 'digital', 'adj', 'raqamli', 'using electronic technology', 'Digital skills are important for work.', 'Technology'),
  w('obsolete', 'obsolete', 'adj', 'eskirgan', 'no longer used because something better exists', 'Typewriters are now obsolete.', 'Technology'),
  w('breakthrough', 'breakthrough', 'n', 'katta yutuq, kashfiyot', 'an important discovery or development', 'Scientists announced a breakthrough in cancer research.', 'Technology'),
  w('virtual', 'virtual', 'adj', 'virtual (kompyuterdagi)', 'existing on a computer, not in the real world', 'Virtual meetings save travel time.', 'Technology'),
  w('database', 'database', 'n', 'ma‘lumotlar bazasi', 'a large collection of organised information on a computer', 'The library keeps its records in a database.', 'Technology'),
  w('wireless', 'wireless', 'adj', 'simsiz', 'without the use of wires', 'Most cafes offer wireless internet.', 'Technology'),
  w('software', 'software', 'n', 'dasturiy ta‘minot', 'the programs used by a computer', 'The company develops educational software.', 'Technology'),
  // Health
  w('nutrition', 'nutrition', 'n', 'oziqlanish', 'food and the way it affects health', 'Good nutrition helps children grow.', 'Health'),
  w('obesity', 'obesity', 'n', 'semizlik', 'the condition of being very overweight', 'Obesity can lead to heart disease.', 'Health'),
  w('symptom', 'symptom', 'n', 'kasallik alomati', 'a sign that a person is ill', 'A cough is a common symptom of a cold.', 'Health'),
  w('vaccine', 'vaccine', 'n', 'vaksina, emlash dori', 'a medicine that protects against a disease', 'The vaccine was given to all children.', 'Health'),
  w('chronic', 'chronic', 'adj', 'surunkali', 'lasting for a long time', 'He suffers from chronic back pain.', 'Health'),
  w('diagnose', 'diagnose', 'v', 'tashxis qo‘ymoq', 'to identify what illness a person has', 'Doctors diagnosed the problem quickly.', 'Health'),
  w('wellbeing', 'well-being', 'n', 'farovonlik, sog‘lom holat', 'the state of being healthy and happy', 'Exercise improves mental well-being.', 'Health'),
  w('sedentary', 'sedentary', 'adj', 'kam harakatli', 'involving a lot of sitting and little exercise', 'A sedentary lifestyle is bad for health.', 'Health'),
  w('stress', 'stress', 'n', 'zo‘riqish', 'worry or pressure that affects body and mind', 'Exams cause stress for many students.', 'Health'),
  w('prescription', 'prescription', 'n', 'retsept', 'a doctor’s written order for medicine', 'You need a prescription to buy this medicine.', 'Health'),
  // Society
  w('inequality', 'inequality', 'n', 'tengsizlik', 'an unfair difference between groups of people', 'Income inequality is increasing in some countries.', 'Society'),
  w('urbanisation', 'urbanisation', 'n', 'shaharlashuv', 'the growth of towns and cities', 'Rapid urbanisation creates housing problems.', 'Society'),
  w('unemployment', 'unemployment', 'n', 'ishsizlik', 'the situation of having no job', 'Unemployment is high among young people.', 'Society'),
  w('immigrant', 'immigrant', 'n', 'muhojir', 'a person who moves to another country to live', 'Many immigrants work in construction.', 'Society'),
  w('community', 'community', 'n', 'jamoa, mahalla', 'a group of people living in the same area', 'The local community built a new park.', 'Society'),
  w('tradition', 'tradition', 'n', 'an‘ana', 'a custom passed down through generations', 'Navruz is an important tradition.', 'Society'),
  w('generation', 'generation', 'n', 'avlod', 'all the people born at about the same time', 'The older generation values family.', 'Society'),
  w('poverty', 'poverty', 'n', 'kambag‘allik', 'the state of being very poor', 'Poverty limits access to education.', 'Society'),
  w('democracy', 'democracy', 'n', 'demokratiya', 'a system where people choose their leaders', 'Democracy gives citizens a voice.', 'Society'),
  w('diversity', 'diversity', 'n', 'xilma-xillik', 'a range of different people or things', 'Cultural diversity enriches a city.', 'Society'),
];

export const vocabById: Record<string, Word> = Object.fromEntries(vocab.map((x) => [x.id, x]));
