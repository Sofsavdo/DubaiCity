import { fits, type Cefr } from '../lib/levels';
import { basicWords } from './vocabBasic';
import { phraseWords } from './vocabPhrases';

export interface Word {
  id: string;
  level: Cefr;
  word: string;
  pos: string;
  uz: string;
  def: string;
  example: string;
  topic: string;
}

const w = (id: string, word: string, pos: string, uz: string, def: string, example: string, topic: string): Word => ({ id, word, pos, uz, def, example, topic, level: 'B2' });

const ieltsWords: Word[] = [
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

  // Work
  w('colleague', 'colleague', 'n', 'hamkasb', 'a person you work with', 'My colleague helped me finish the report.', 'Work'),
  w('deadline', 'deadline', 'n', 'oxirgi muddat', 'the time by which something must be finished', 'The deadline for the project is Monday.', 'Work'),
  w('promotion', 'promotion', 'n', 'lavozimda ko‘tarilish', 'a move to a more important job', 'She received a promotion after two years.', 'Work'),
  w('salary', 'salary', 'n', 'oylik maosh', 'money paid to an employee every month', 'The salary is paid at the end of the month.', 'Work'),
  w('resign', 'resign', 'v', 'ishdan bo‘shamoq (o‘z xohishi bilan)', 'to officially leave your job', 'He resigned to start his own business.', 'Work'),
  w('flexible', 'flexible', 'adj', 'moslashuvchan', 'able to change easily to suit new conditions', 'Flexible hours help parents with young children.', 'Work'),
  w('internship', 'internship', 'n', 'amaliyot (stajirovka)', 'a short period of work to gain experience', 'She did an internship at a bank.', 'Work'),
  w('workload', 'workload', 'n', 'ish hajmi', 'the amount of work a person has to do', 'A heavy workload can cause stress.', 'Work'),
  w('negotiate', 'negotiate', 'v', 'muzokara qilmoq', 'to discuss something to reach an agreement', 'They negotiated a better price.', 'Work'),
  w('qualification', 'qualification', 'n', 'malaka, diplom', 'an exam passed or a course completed', 'A teaching qualification is required for this job.', 'Work'),
  w('freelance', 'freelance', 'adj', 'frilans (mustaqil ishlovchi)', 'working for different companies, not one employer', 'Many designers work as freelance workers.', 'Work'),
  w('recruit', 'recruit', 'v', 'ishga yollamoq', 'to find and employ new people', 'The company plans to recruit fifty workers.', 'Work'),
  // Travel
  w('destination', 'destination', 'n', 'boriladigan manzil', 'the place where someone is going', 'Samarkand is a popular tourist destination.', 'Travel'),
  w('itinerary', 'itinerary', 'n', 'sayohat rejasi', 'a detailed plan of a journey', 'Our itinerary includes three cities.', 'Travel'),
  w('accommodation', 'accommodation', 'n', 'turar joy', 'a place to stay, such as a hotel', 'Accommodation is expensive in summer.', 'Travel'),
  w('sightseeing', 'sightseeing', 'n', 'diqqatga sazovor joylarni ko‘rish', 'visiting interesting places as a tourist', 'We spent the day sightseeing in the old town.', 'Travel'),
  w('passport', 'passport', 'n', 'xorijiy pasport', 'an official document for travelling abroad', 'You must show your passport at the border.', 'Travel'),
  w('luggage', 'luggage', 'n', 'yuk, bagaj', 'bags and suitcases you take on a journey', 'Her luggage was lost at the airport.', 'Travel'),
  w('currency', 'currency', 'n', 'valyuta', 'the money used in a country', 'The local currency is easy to exchange.', 'Travel'),
  w('excursion', 'excursion', 'n', 'ekskursiya', 'a short trip made for pleasure', 'The hotel organises an excursion to the mountains.', 'Travel'),
  w('commute', 'commute', 'v', 'ish joyiga qatnamoq', 'to travel regularly between home and work', 'He commutes to the city by train.', 'Travel'),
  w('landscape', 'landscape', 'n', 'manzara', 'everything you can see in an area of land', 'The landscape here is wide and green.', 'Travel'),
  w('hospitality', 'hospitality', 'n', 'mehmondo‘stlik', 'friendly and generous treatment of guests', 'Visitors praise the hospitality of local people.', 'Travel'),
  w('tourism', 'tourism', 'n', 'turizm', 'the business of providing services for tourists', 'Tourism creates jobs in small towns.', 'Travel'),
  // Media
  w('journalist', 'journalist', 'n', 'jurnalist', 'a person who writes news for media', 'The journalist interviewed the mayor.', 'Media'),
  w('headline', 'headline', 'n', 'sarlavha', 'the title of a newspaper article', 'The headline caught everyone’s attention.', 'Media'),
  w('broadcast', 'broadcast', 'v', 'efirga uzatmoq', 'to send out a programme on television or radio', 'The match will be broadcast live.', 'Media'),
  w('censorship', 'censorship', 'n', 'tsenzura', 'control over what people can read or see', 'Censorship limits freedom of speech.', 'Media'),
  w('influence', 'influence', 'v', 'ta‘sir qilmoq', 'to affect how someone thinks or acts', 'Advertising can influence what we buy.', 'Media'),
  w('audience', 'audience', 'n', 'tomoshabinlar, auditoriya', 'the people who watch or listen to something', 'The show attracts a young audience.', 'Media'),
  w('publish', 'publish', 'v', 'nashr qilmoq', 'to print and sell a book or article', 'The university will publish her research.', 'Media'),
  w('subscription', 'subscription', 'n', 'obuna', 'money paid regularly to receive a service', 'A monthly subscription gives access to all videos.', 'Media'),
  w('viral', 'viral', 'adj', 'tez tarqaluvchi (virusli)', 'spreading very quickly on the internet', 'The video went viral in one day.', 'Media'),
  w('reliable', 'reliable', 'adj', 'ishonchli', 'able to be trusted', 'Check that the news source is reliable.', 'Media'),
  w('bias', 'bias', 'n', 'tarafkashlik', 'an unfair preference for one side', 'The article showed clear bias against the plan.', 'Media'),
  w('exposure', 'exposure', 'n', 'ta‘sirga uchrash, tanishuv', 'the experience of being affected by something', 'Children’s exposure to screens is increasing.', 'Media'),
  // Science
  w('experiment', 'experiment', 'n', 'tajriba', 'a scientific test to discover something', 'The experiment lasted three weeks.', 'Science'),
  w('hypothesis', 'hypothesis', 'n', 'gipoteza, faraz', 'an idea that has not yet been proved', 'The results support our hypothesis.', 'Science'),
  w('evidence', 'evidence', 'n', 'dalil, isbot', 'facts that show something is true', 'There is strong evidence that exercise helps memory.', 'Science'),
  w('laboratory', 'laboratory', 'n', 'laboratoriya', 'a room where scientific work is done', 'The laboratory is open to students.', 'Science'),
  w('analyse', 'analyse', 'v', 'tahlil qilmoq', 'to examine something carefully', 'Researchers analysed data from 500 people.', 'Science'),
  w('theory', 'theory', 'n', 'nazariya', 'a set of ideas that explains something', 'Einstein developed a famous theory of gravity.', 'Science'),
  w('species', 'species', 'n', 'tur (hayvon yoki o‘simlik turi)', 'a group of animals or plants of the same kind', 'Many species are in danger of disappearing.', 'Science'),
  w('genetic', 'genetic', 'adj', 'genetik, irsiy', 'relating to genes passed from parents to children', 'Some diseases have a genetic cause.', 'Science'),
  w('research', 'research', 'n', 'tadqiqot', 'detailed study to discover new facts', 'Research shows that sleep improves learning.', 'Science'),
  w('microscope', 'microscope', 'n', 'mikroskop', 'a tool for seeing very small things', 'Bacteria can be seen under a microscope.', 'Science'),
  w('discovery', 'discovery', 'n', 'kashfiyot', 'finding something new for the first time', 'The discovery changed modern medicine.', 'Science'),
  w('measure', 'measure', 'v', 'o‘lchamoq', 'to find the size or amount of something', 'Scientists measure the temperature every hour.', 'Science'),
  // Economy
  w('inflation', 'inflation', 'n', 'inflyatsiya (narxlar o‘sishi)', 'a general rise in prices', 'Inflation makes everyday goods more expensive.', 'Economy'),
  w('export', 'export', 'v', 'eksport qilmoq', 'to sell goods to another country', 'The country exports cotton and fruit.', 'Economy'),
  w('import', 'import', 'v', 'import qilmoq', 'to buy goods from another country', 'We import most of our electronics.', 'Economy'),
  w('budget', 'budget', 'n', 'byudjet', 'a plan for how money will be spent', 'The family keeps a strict monthly budget.', 'Economy'),
  w('invest', 'invest', 'v', 'sarmoya kiritmoq', 'to put money into something to make a profit', 'Many people invest in property.', 'Economy'),
  w('profit', 'profit', 'n', 'foyda', 'money earned after costs are paid', 'The shop made a small profit this year.', 'Economy'),
  w('tax', 'tax', 'n', 'soliq', 'money paid to the government', 'Income tax is deducted from salaries.', 'Economy'),
  w('consumer', 'consumer', 'n', 'iste‘molchi', 'a person who buys goods or services', 'Consumers are buying more products online.', 'Economy'),
  w('recession', 'recession', 'n', 'iqtisodiy tanazzul', 'a period when the economy becomes weaker', 'The recession caused many companies to close.', 'Economy'),
  w('wealthy', 'wealthy', 'adj', 'boy, badavlat', 'having a lot of money', 'The wealthy family owns several businesses.', 'Economy'),
  w('afford', 'afford', 'v', 'qurbi yetmoq, imkoniyati bo‘lmoq', 'to have enough money to buy something', 'Many students cannot afford a laptop.', 'Economy'),
  w('industry', 'industry', 'n', 'sanoat', 'the production of goods in factories', 'The car industry employs thousands of people.', 'Economy'),
  // Crime and law
  w('crime', 'crime', 'n', 'jinoyat', 'an action that is against the law', 'Crime has fallen in the city centre.', 'Law'),
  w('penalty', 'penalty', 'n', 'jazo', 'a punishment for breaking a rule or law', 'The penalty for speeding is a fine.', 'Law'),
  w('witness', 'witness', 'n', 'guvoh', 'a person who sees a crime or accident', 'The witness described the driver to the police.', 'Law'),
  w('regulation', 'regulation', 'n', 'qoida, tartibga solish', 'an official rule made by authority', 'New regulations protect workers’ safety.', 'Law'),
  w('prohibit', 'prohibit', 'v', 'taqiqlamoq', 'to officially forbid something', 'Smoking is prohibited in public buildings.', 'Law'),
  w('fine', 'fine', 'n', 'jarima', 'money paid as a punishment', 'He had to pay a fine for parking illegally.', 'Law'),
  w('offender', 'offender', 'n', 'qonunbuzar', 'a person who has broken the law', 'Young offenders need education, not just punishment.', 'Law'),
  w('justice', 'justice', 'n', 'adolat', 'fair treatment according to the law', 'Everyone has the right to justice.', 'Law'),
  w('violence', 'violence', 'n', 'zo‘ravonlik', 'behaviour intended to hurt people', 'Violence in films may affect children.', 'Law'),
  w('rehabilitation', 'rehabilitation', 'n', 'reabilitatsiya (qayta tiklash)', 'helping someone return to normal life', 'Rehabilitation programmes help prisoners find work.', 'Law'),
  // Culture and arts
  w('heritage', 'heritage', 'n', 'madaniy meros', 'traditions and buildings from the past', 'The old city is part of our cultural heritage.', 'Culture'),
  w('exhibition', 'exhibition', 'n', 'ko‘rgazma', 'a public show of art or objects', 'The exhibition attracted thousands of visitors.', 'Culture'),
  w('festival', 'festival', 'n', 'festival, bayram', 'a special event with music, food or art', 'The film festival takes place every spring.', 'Culture'),
  w('ancient', 'ancient', 'adj', 'qadimiy', 'very old, from a long time ago', 'Ancient buildings line the main square.', 'Culture'),
  w('preserve', 'preserve', 'v', 'saqlab qolmoq', 'to keep something in its original condition', 'We must preserve old manuscripts.', 'Culture'),
  w('craft', 'craft', 'n', 'hunar, qo‘l san‘ati', 'a skill of making things by hand', 'Pottery is a traditional craft here.', 'Culture'),
  w('cuisine', 'cuisine', 'n', 'oshxona (milliy taomlar)', 'a style of cooking of a country', 'Uzbek cuisine is famous for plov.', 'Culture'),
  w('folk', 'folk', 'adj', 'xalq, xalqona', 'traditional among ordinary people', 'Folk music is played at weddings.', 'Culture'),
  w('masterpiece', 'masterpiece', 'n', 'durdona asar', 'an extremely good piece of art or work', 'The painting is considered a masterpiece.', 'Culture'),
  w('museum', 'museum', 'n', 'muzey', 'a building where important objects are kept', 'The museum is free on Sundays.', 'Culture'),
  // Housing and cities
  w('infrastructure', 'infrastructure', 'n', 'infratuzilma', 'basic systems like roads, water and electricity', 'Good infrastructure helps cities grow.', 'City'),
  w('congestion', 'congestion', 'n', 'tirbandlik (tirband yo‘llar)', 'too much traffic in one area', 'Traffic congestion wastes time every morning.', 'City'),
  w('suburb', 'suburb', 'n', 'shahar atrofi, chekka mahalla', 'an area on the edge of a large city', 'They live in a quiet suburb.', 'City'),
  w('rent', 'rent', 'n', 'ijara haqi', 'money paid regularly to use a home', 'The rent rose by ten per cent.', 'City'),
  w('overcrowded', 'overcrowded', 'adj', 'haddan tashqari gavjum', 'having too many people', 'The buses are overcrowded at rush hour.', 'City'),
  w('public', 'public', 'adj', 'jamoat, ommaviy', 'for everyone in the community to use', 'Public transport is cheap and reliable.', 'City'),
  w('skyscraper', 'skyscraper', 'n', 'osmono‘par bino', 'a very tall building', 'A new skyscraper is being built downtown.', 'City'),
  w('pedestrian', 'pedestrian', 'n', 'piyoda', 'a person who is walking, not driving', 'Pedestrians cross the street at the lights.', 'City'),
  w('renovate', 'renovate', 'v', 'ta‘mirlamoq, yangilamoq', 'to repair and improve an old building', 'They renovated the old school last year.', 'City'),
  w('resident', 'resident', 'n', 'aholi, yashovchi', 'a person who lives in a place', 'Residents complained about the noise.', 'City'),
  // Academic verbs and adjectives
  w('significant', 'significant', 'adj', 'sezilarli, muhim', 'large or important enough to have an effect', 'There was a significant rise in prices.', 'Academic'),
  w('estimate', 'estimate', 'v', 'taxmin qilmoq, baholamoq', 'to guess a number or value', 'Experts estimate that the population will double.', 'Academic'),
  w('indicate', 'indicate', 'v', 'ko‘rsatmoq, ishora qilmoq', 'to show that something is true', 'The figures indicate a steady decline.', 'Academic'),
  w('whereas', 'whereas', 'conj', 'holbuki, aksincha', 'used to compare two different facts', 'Some students prefer lectures, whereas others like projects.', 'Academic'),
  w('therefore', 'therefore', 'adv', 'shuning uchun', 'for that reason', 'Prices rose; therefore, fewer people bought cars.', 'Academic'),
  w('beneficial', 'beneficial', 'adj', 'foydali', 'having a good effect', 'Regular exercise is beneficial for everyone.', 'Academic'),
  w('essential', 'essential', 'adj', 'zarur, muhim', 'absolutely necessary', 'Sleep is essential for good health.', 'Academic'),
  w('moreover', 'moreover', 'adv', 'bundan tashqari', 'used to add more information', 'The plan is cheap; moreover, it is safe.', 'Academic'),
  w('decline', 'decline', 'n', 'pasayish', 'a gradual fall in amount or quality', 'There was a decline in the number of visitors.', 'Academic'),
  w('rapidly', 'rapidly', 'adv', 'tez, jadal', 'very quickly', 'Technology is changing rapidly.', 'Academic'),
  w('consequence', 'consequence', 'n', 'oqibat', 'a result of an action', 'Pollution has serious consequences for health.', 'Academic'),
  w('contribute', 'contribute', 'v', 'hissa qo‘shmoq', 'to help to cause or achieve something', 'Exercise contributes to better health.', 'Academic'),
];

// IELTS so'zlarining qiyinlik darajasi (aniq belgilanmaganlari B2)
const C1_IDS = new Set(['dissertation', 'obsolete', 'breakthrough', 'sedentary', 'prescription', 'urbanisation', 'recession', 'rehabilitation', 'censorship', 'hypothesis', 'offender', 'inflation', 'masterpiece', 'whereas', 'prohibit', 'heritage', 'bias', 'exposure', 'congestion', 'infrastructure', 'genetic', 'chronic', 'inequality', 'deforestation', 'compulsory', 'literacy', 'negotiate', 'microscope', 'species', 'renovate', 'moreover']);
const B1_IDS = new Set(['pollution', 'climate', 'recycle', 'tuition', 'scholarship', 'graduate', 'lecture', 'device', 'digital', 'stress', 'salary', 'passport', 'luggage', 'currency', 'museum', 'festival', 'tax', 'crime', 'fine', 'colleague', 'deadline', 'accommodation', 'sightseeing', 'headline', 'vaccine', 'symptom', 'experiment', 'research', 'budget', 'profit', 'community', 'tradition', 'poverty', 'rent', 'public', 'suburb', 'therefore', 'essential', 'significant', 'estimate', 'tourism', 'journalist', 'audience', 'publish', 'export', 'import', 'afford', 'industry', 'evidence', 'justice', 'violence', 'ancient', 'cuisine', 'festival', 'commute', 'landscape', 'resident', 'software', 'database', 'wireless', 'unemployment', 'immigrant', 'democracy', 'generation', 'internship', 'resign', 'promotion']);
const leveled = ieltsWords.map((x): Word => ({ ...x, level: C1_IDS.has(x.id) ? 'C1' : B1_IDS.has(x.id) ? 'B1' : 'B2' }));

export const vocab: Word[] = [...basicWords, ...phraseWords, ...leveled];

/** Foydalanuvchi darajasiga mos so'zlar: bir pog'ona past/yuqori (A1 uchun A1–A2, C1 uchun B2–C1). */
export function vocabForLevel(level: Cefr | null | undefined): Word[] {
  if (!level) return vocab;
  const pool = vocab.filter((x) => fits(x.level, level, 1, 1));
  return pool.length >= 24 ? pool : vocab;
}

export const vocabById: Record<string, Word> = Object.fromEntries(vocab.map((x) => [x.id, x]));
