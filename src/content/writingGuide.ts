// Writing Task 2 bo'yicha original dars materiali: insho turlari, tipik xatolar va 10 asosiy mavzu.
// Hamma namuna insholar va so'z ro'yxatlari Bandly uchun alohida yozilgan (boshqa kitoblardan ko'chirilmagan).

export type EssayTypeId = 'discuss' | 'agree' | 'problem' | 'cause' | 'evaluate';

export interface EssayType {
  id: EssayTypeId;
  name: string;
  /** Topshiriqda shu iboralar uchraydi */
  signals: string[];
  /** Fikr bildirish talab etiladimi */
  opinion: 'ha' | 'yo‘q';
  structure: string[];
  frames: string[];
  tipUz: string;
}

export const essayTypes: EssayType[] = [
  {
    id: 'discuss', name: 'Ikki fikrni muhokama qilish (Discuss both views)', opinion: 'ha',
    signals: ['Discuss both views', 'Some people think ... while others believe ...', 'Give your own opinion'],
    structure: ['1-abzats: mavzu + ikkala fikr + o‘z pozitsiyangizning qisqa belgisi', '2-abzats: birinchi fikr va 2 ta dalil', '3-abzats: ikkinchi fikr va 2 ta dalil', '4-abzats: xulosa, aniq o‘z fikringiz'],
    frames: ['It is often argued that ..., whereas others maintain that ...', 'Supporters of this view point out that ...', 'On the other hand, critics argue that ...', 'On balance, I believe that ...'],
    tipUz: 'Ikkala tomonga teng o‘rin bering, so‘ng o‘z fikringizni aniq ayting. Faqat bitta tomonni yozish bandni tushiradi.',
  },
  {
    id: 'agree', name: 'Fikrga qo‘shilish darajasi (To what extent do you agree?)', opinion: 'ha',
    signals: ['To what extent do you agree or disagree?', 'How far do you agree?', 'Do you agree or disagree?'],
    structure: ['1-abzats: mavzu + aniq pozitsiya (qisman/to‘liq qo‘shilaman yoki yo‘q)', '2-abzats: eng kuchli sabab va misol', '3-abzats: ikkinchi sabab; qarshi fikrga qisqa javob', '4-abzats: pozitsiyani qaytarib xulosa'],
    frames: ['I strongly agree that ...', 'To a large extent, I agree with this view because ...', 'Although some argue that ..., this overlooks ...', 'For these reasons, I maintain that ...'],
    tipUz: 'Pozitsiyani birinchi abzatsdayoq ochiq yozing va oxirigacha o‘zgartirmang.',
  },
  {
    id: 'problem', name: 'Muammo va yechim (Problems and solutions)', opinion: 'yo‘q',
    signals: ['What problems does this cause?', 'What can be done to solve this?', 'What measures could be taken?'],
    structure: ['1-abzats: mavzu va muammoning dolzarbligi', '2-abzats: 2 ta asosiy muammo, har biri izoh va misol bilan', '3-abzats: har bir muammoga mos yechim, kim amalga oshirishi', '4-abzats: qisqa xulosa'],
    frames: ['One major problem is that ...', 'This can lead to ...', 'A practical solution would be to ...', 'Governments could also ...'],
    tipUz: 'Har bir yechim ma’lum bir muammoga mos bo‘lsin. Savol so‘ramasa, keskin shaxsiy fikr yozmang.',
  },
  {
    id: 'cause', name: 'Sabab va oqibat (Causes and effects)', opinion: 'yo‘q',
    signals: ['What are the causes of this?', 'What effects does it have?', 'Why is this happening?'],
    structure: ['1-abzats: hodisa va uning ko‘lami', '2-abzats: 2 ta asosiy sabab', '3-abzats: 2 ta oqibat (shaxs va jamiyat uchun)', '4-abzats: xulosa'],
    frames: ['There are several reasons for this trend.', 'Primarily, this is due to ...', 'As a consequence, ...', 'The long-term impact may be ...'],
    tipUz: 'Sabab va oqibatni adashtirmang: sabab "nega bo‘layapti", oqibat "nima bo‘ladi".',
  },
  {
    id: 'evaluate', name: 'Afzallik va kamchilik (Advantages and disadvantages)', opinion: 'ha',
    signals: ['Do the advantages outweigh the disadvantages?', 'Discuss the advantages and disadvantages', 'Is this a positive or negative development?'],
    structure: ['1-abzats: mavzu va ikkala tomon borligi', '2-abzats: afzalliklar (2 ta)', '3-abzats: kamchiliklar (2 ta)', '4-abzats: qaysi biri og‘irroq ekanligi bo‘yicha xulosa'],
    frames: ['The main advantage of this is that ...', 'However, there are drawbacks.', 'On balance, the benefits outweigh the costs because ...', 'In my view, the drawbacks are more serious since ...'],
    tipUz: '"Outweigh" so‘ralsa, oxirida albatta qaysi tomon og‘irligini ayting.',
  },
];

export interface CommonMistake { id: string; title: string; why: string; fix: string }
export const commonMistakes: CommonMistake[] = [
  { id: 'contractions', title: 'Qisqartmalar (don’t, it’s, can’t)', why: 'Akademik yozuv rasmiy bo‘ladi.', fix: 'To‘liq shakl: do not, it is, cannot.' },
  { id: 'words', title: 'So‘zlar soni noto‘g‘ri', why: 'Task 2 da kamida 250 so‘z kerak; juda uzun insho vaqtingizni oladi va xatoni oshiradi.', fix: '250–320 so‘z oralig‘ida yozing.' },
  { id: 'informal', title: 'Norasmiy so‘zlar (nice, kids, a lot of, stuff)', why: 'Lexical Resource bandini tushiradi.', fix: 'beneficial, children, numerous, issues kabi rasmiy so‘zlarni ishlating.' },
  { id: 'anecdote', title: 'Shaxsiy hikoyalar ("my friend ...", "when I was ...")', why: 'Task 2 da dunyodan misol kerak, shaxsiy voqea emas.', fix: 'Umumiy misol: "In Scandinavia, ...", "Studies show that ..."' },
  { id: 'emotion', title: 'Haddan tashqari hissiy so‘zlar (terrible, I hate)', why: 'Akademik uslub betaraf.', fix: 'unacceptable, I disapprove of, undesirable.' },
  { id: 'offtopic', title: 'Mavzudan chetga chiqish', why: 'Task Response bandi tushadi.', fix: 'Yozishdan oldin savolning kalit so‘zlarini tagiga chizing va 2 daqiqa reja tuzing.' },
  { id: 'type', title: 'Insho turini noto‘g‘ri aniqlash', why: 'Muammo-yechim savolida o‘z fikringizni yozib, yechimni unutish.', fix: 'Avval savol turini aniqlang (Insho turlari bo‘limi).' },
  { id: 'structure', title: 'Abzatssiz yoki xulosasiz insho', why: 'Coherence and Cohesion bandi pasayadi.', fix: '4 abzats: kirish, 2 asosiy, xulosa. "In conclusion" bilan tugating.' },
];

export interface TopicVocab { phrase: string; pos: string; uz: string; def: string; example: string; level: 'B2' | 'C1' }
export interface WritingTopic {
  id: string;
  title: string;
  about: string;
  type: EssayTypeId;
  prompt: string;
  outline: string[];
  /** **qalin** belgilangan so'zlar — mavzu so'zlari */
  essay: string;
  vocab: TopicVocab[];
}

const v = (phrase: string, pos: string, uz: string, def: string, example: string, level: 'B2' | 'C1' = 'B2'): TopicVocab => ({ phrase, pos, uz, def, example, level });

export const writingTopics: WritingTopic[] = [
  {
    id: 'work', title: 'Ish va kasb', type: 'discuss',
    about: 'Ish haftasi, motivatsiya, kasbiy charchoq, ish va shaxsiy hayot muvozanati.',
    prompt: 'Some companies are introducing a four-day working week with no reduction in pay, believing that it makes employees more productive. Others think it would harm business. Discuss both views and give your own opinion.',
    outline: ['Kirish: 4 kunlik hafta munozarali', '1-fikr: unumdorlik va sog‘liq', '2-fikr: biznes xarajatlari va mijozlar', 'Xulosa: o‘z fikr (masalan, shartli qo‘llab-quvvatlash)'],
    essay: `A four-day working week is attracting growing attention from employers and governments alike. Supporters believe that it makes staff healthier and more efficient, while critics fear that it would damage business performance. This essay will consider both positions before explaining why I believe the first is more convincing.

Advocates of a shorter week point out, first of all, that rested employees are more **productive**. Trials in several European countries have shown that workers who enjoy a longer weekend report lower stress and fewer cases of **burnout**, and they often complete the same tasks in less time. In addition, a better **work-life balance** can increase **job satisfaction**, which helps companies to **retain** talented people instead of paying to recruit and train replacements.

Opponents, however, argue that many businesses cannot simply close for an extra day. Shops, hospitals and call centres must serve customers continuously, so a shorter week might force them to hire additional staff or pay **overtime**, which would raise costs. Smaller firms in particular may lack the money to absorb such changes, and they could lose clients to competitors that remain open.

In my view, the benefits outweigh these concerns, provided that the system is introduced flexibly. Companies can use rotating schedules to keep services running, and any extra expense is likely to be recovered through a more motivated **workforce** and lower absence. A clear **incentive** for both sides is therefore possible.

In conclusion, although a four-day week creates practical challenges for service industries, I believe that its advantages for employees and, eventually, for employers are more significant.`,
    vocab: [
      v('productive', 'adj', 'unumdor (ish bo‘yicha)', 'achieving a lot in a short time', 'Rested employees are more productive.'),
      v('burnout', 'n', 'kasbiy charchoq (kuchdan toyish)', 'extreme tiredness caused by too much work', 'Long hours often lead to burnout.'),
      v('work-life balance', 'n', 'ish va shaxsiy hayot muvozanati', 'a healthy division of time between job and private life', 'A good work-life balance improves mental health.'),
      v('job satisfaction', 'n', 'ishdan qoniqish', 'the feeling of being happy with your work', 'Job satisfaction rises when staff feel valued.'),
      v('retain', 'v', 'xodimni saqlab qolmoq', 'to keep something or someone', 'Companies want to retain talented staff.'),
      v('overtime', 'n', 'ish vaqtidan tashqari ish', 'extra hours worked beyond normal time', 'Many nurses work overtime every week.'),
      v('incentive', 'n', 'rag‘batlantiruvchi omil', 'something that encourages you to act', 'A bonus is a strong incentive to work harder.'),
      v('workforce', 'n', 'ishchi kuchi (xodimlar jamoasi)', 'all the people who work for a company or country', 'A healthy workforce is more reliable.'),
    ],
  },
  {
    id: 'education', title: 'Ta‘lim', type: 'agree',
    about: 'Maktab dasturi, amaliy ko‘nikmalar, kasb-hunar ta‘limi, tanqidiy fikrlash.',
    prompt: 'Some people believe that schools should concentrate on teaching practical skills rather than academic subjects. To what extent do you agree or disagree?',
    outline: ['Kirish: qisman qo‘shilaman', '1-sabab: ish topish va amaliy ko‘nikma', '2-sabab: nazariy fanlar fikrlashni o‘stiradi (qarshi fikr)', 'Xulosa: muvozanat'],
    essay: `Education systems around the world are under pressure to prepare young people for the labour market. Some argue that schools should therefore teach mainly practical skills. I partly agree with this view, but I believe that academic subjects remain essential and should not be replaced.

On the one hand, practical training clearly improves **employability**. Students who learn trades, computing or financial management often find work more quickly, because employers value people who can contribute from the first day. **Vocational** courses and **apprenticeship** schemes, which are widespread in Germany, combine classroom study with real experience and produce confident, skilled graduates. For young people who dislike theoretical lessons, such options can prevent early dropout.

On the other hand, a curriculum without academic content would leave students poorly equipped for a changing world. Subjects such as mathematics, science and literature do not only transmit facts; they develop **critical thinking** and the ability to analyse complex problems. Those abilities are transferable, and they allow workers to adapt when technology changes their jobs. Moreover, children who rely on **rote learning** or narrow training may struggle to **acquire** new skills later in life.

The most sensible approach, in my opinion, is a balanced one. Schools should give every pupil a strong academic base up to a certain age and then offer practical routes for those who prefer them. In this way, society can produce **well-rounded** citizens as well as skilled workers.

In conclusion, practical skills deserve a larger place in education, yet I disagree that they should replace academic subjects, since both are needed for long-term success.`,
    vocab: [
      v('employability', 'n', 'ish topish layoqati', 'the skills that make someone attractive to employers', 'Practical courses improve employability.'),
      v('vocational', 'adj', 'kasb-hunarga oid', 'relating to training for a particular job', 'Vocational training prepares students for specific jobs.'),
      v('apprenticeship', 'n', 'shogirdlik (ishlab o‘rganish)', 'a period of learning a trade by working', 'An apprenticeship combines study with paid work.'),
      v('critical thinking', 'n', 'tanqidiy fikrlash', 'the ability to analyse and judge ideas carefully', 'Schools should teach critical thinking.', 'C1'),
      v('rote learning', 'n', 'mexanik yodlash', 'learning by repeating without understanding', 'Rote learning does not build real understanding.'),
      v('acquire', 'v', 'egallamoq (ko‘nikma, bilim)', 'to gain a skill or knowledge', 'Students acquire skills through practice.'),
      v('well-rounded', 'adj', 'har tomonlama rivojlangan', 'having a wide range of abilities', 'Schools should produce well-rounded graduates.'),
      v('academic', 'adj', 'nazariy-ilmiy', 'relating to study and scholarship', 'Academic subjects develop abstract thinking.'),
    ],
  },
  {
    id: 'children', title: 'Bolalar va oila', type: 'problem',
    about: 'Ekran vaqti, bolalar sog‘lig‘i, ota-ona nazorati, ijtimoiy ko‘nikmalar.',
    prompt: 'In many countries, children now spend more time using screens than playing outdoors. What problems does this cause, and what can be done to address them?',
    outline: ['Kirish: muammo ko‘lami', 'Muammolar: salomatlik va ijtimoiy ko‘nikma', 'Yechimlar: ota-onalar, maktab, davlat', 'Xulosa'],
    essay: `Smartphones, tablets and games consoles have become part of daily life for children, and many now spend several hours a day in front of a screen. This trend raises serious concerns, but there are practical ways of dealing with it.

The first problem is physical health. Children who rarely play outside are more likely to become overweight, and **childhood obesity** has risen sharply in many cities. A **sedentary** routine can also harm sleep and posture. A second problem concerns development. Because young people spend less time playing face to face, they may fail to develop **social skills** such as cooperation and empathy. Furthermore, fast, constantly changing content can shorten a child's **attention span**, which makes it harder to concentrate on lessons, and some games can even lead to **addiction**.

Several measures could reduce these risks. Parents can set clear limits on **screen time** and **supervise** what their children watch, using **parental control** software where necessary. Equally important is the example set by adults; families that share meals and weekend activities without devices send a positive message. Schools can contribute by organising sport and clubs, and local governments could build safe parks so that **outdoor play** becomes an easy and attractive option. Public campaigns that explain the health risks to parents would also help, and regular conversations at home about online risks teach children to make safer choices themselves.

In conclusion, excessive screen use damages children's health and development, yet a combination of family rules, school activities and better public facilities can restore a healthier balance between technology and real life.`,
    vocab: [
      v('screen time', 'n', 'ekran oldida o‘tkaziladigan vaqt', 'the time spent using devices with screens', 'Experts advise limiting screen time for young children.'),
      v('attention span', 'n', 'diqqat davomiyligi', 'the length of time you can concentrate', 'Short videos can reduce a child’s attention span.', 'C1'),
      v('outdoor play', 'n', 'ochiq havoda o‘yin', 'games and activities outside', 'Outdoor play builds strength and teamwork.'),
      v('parental control', 'n', 'ota-ona nazorati (dasturi)', 'tools that let parents restrict what children can use', 'Parental control software blocks unsuitable content.'),
      v('social skills', 'n', 'ijtimoiy ko‘nikmalar', 'the abilities needed to interact with others', 'Children develop social skills by playing together.'),
      v('addiction', 'n', 'qaramlik (zararli odat)', 'being unable to stop doing something harmful', 'Some games can lead to addiction.'),
      v('supervise', 'v', 'nazorat ostida kuzatmoq', 'to watch over someone to make sure they are safe', 'Adults should supervise what children watch online.'),
      v('childhood obesity', 'n', 'bolalar semizligi', 'serious overweight in young people', 'Childhood obesity is rising in many cities.'),
    ],
  },
  {
    id: 'environment', title: 'Atrof-muhit va energiya', type: 'cause',
    about: 'Qazilma yoqilg‘i, qayta tiklanadigan energiya, uglerod izi, davlat siyosati.',
    prompt: 'Many countries still depend heavily on fossil fuels for their energy. What are the reasons for this, and what could be done to encourage the use of renewable energy?',
    outline: ['Kirish', 'Sabablar: narx, infratuzilma, odat', 'Yechimlar: subsidiya, investitsiya, ta‘lim', 'Xulosa'],
    essay: `Despite growing awareness of climate change, coal, oil and gas still provide most of the world's energy. Understanding why this is so is the first step towards a faster **transition** to cleaner sources.

There are two main reasons for the continued reliance on **fossil fuels**. The first is cost and convenience. Existing power stations, pipelines and vehicles were built around coal, oil and gas, so changing the system requires enormous investment, and many poorer countries simply cannot afford it. The second reason is political. Energy companies employ large numbers of people and exert strong influence on policy, which makes governments reluctant to **phase out** industries that provide jobs and tax income. In addition, many nations still **depend on** imported fuel, and they worry that relying on new technology could make supply less secure.

Nevertheless, there are effective ways to promote cleaner power. Governments could reduce the price of a **solar panel** or a wind turbine through a **subsidy**, and at the same time remove financial support for polluting fuels. Investment in modern electricity grids and battery storage would make renewable supply more reliable. Public education also matters: when households and businesses understand how to reduce their **carbon footprint**, demand for green energy rises. International cooperation, for example the transfer of technology to developing countries, would allow lower-income regions to skip the most polluting stage of development.

To summarise, the dependence on fossil fuels is explained mainly by cost, infrastructure and political interests. However, sustained financial support, better infrastructure and public awareness could reduce **greenhouse gas** emissions and accelerate the switch to renewable energy.`,
    vocab: [
      v('fossil fuels', 'n', 'qazilma yoqilg‘i', 'coal, oil and gas formed from ancient plants and animals', 'Burning fossil fuels releases carbon dioxide.'),
      v('greenhouse gas', 'n', 'issiqxona gazi', 'a gas that traps heat in the atmosphere', 'Carbon dioxide is the most common greenhouse gas.'),
      v('carbon footprint', 'n', 'uglerod izi', 'the amount of carbon dioxide produced by a person or activity', 'Flying less can reduce your carbon footprint.'),
      v('subsidy', 'n', 'subsidiya (davlat moliyaviy yordami)', 'money given by the state to support an industry', 'A subsidy can make solar panels cheaper.', 'C1'),
      v('phase out', 'phrasal verb', 'bosqichma-bosqich to‘xtatmoq', 'to stop using something gradually', 'The country plans to phase out coal by 2040.', 'C1'),
      v('solar panel', 'n', 'quyosh paneli', 'a device that turns sunlight into electricity', 'A solar panel on the roof can power a small home.'),
      v('transition', 'n', 'o‘tish bosqichi', 'a change from one state to another', 'The transition to clean energy will take decades.'),
      v('depend on', 'phrasal verb', 'ga tayanmoq (bog‘liq bo‘lmoq)', 'to need something in order to survive or work', 'Many countries depend on imported oil.'),
    ],
  },
  {
    id: 'culture', title: 'Madaniyat va an‘analar', type: 'discuss',
    about: 'An‘analarni saqlash, globallashuv, avlodlar o‘rtasidagi farq, madaniy o‘zlik.',
    prompt: 'Some people think that traditional customs should be preserved at all costs, while others believe that it is natural for them to disappear as society changes. Discuss both views and give your own opinion.',
    outline: ['Kirish', 'Saqlash tarafdorlari: o‘zlik, tarix', 'O‘zgarish tarafdorlari: hayot rivoji', 'Xulosa: tanlab saqlash'],
    essay: `Traditions connect people with their past, yet modern life is changing the way societies live. Opinions are divided on whether old customs should be protected or allowed to fade. This essay discusses both views and explains why I favour a selective approach.

Those who want to preserve traditions argue that they are the foundation of **cultural identity**. Festivals, crafts and music give communities a sense of belonging and help children understand where they come from. Moreover, if a custom or craft disappears, it is very difficult to recreate it. In an era of **globalisation**, when films and brands from a few countries dominate everywhere, protecting local culture can prevent the world from becoming uniform. Efforts to **revive** nearly forgotten crafts and to **pass down** stories through families are therefore valuable.

By contrast, others maintain that societies naturally evolve and that clinging to every old practice can be a burden. A **generation gap** often appears when young people find certain **customs** unsuited to modern life, for instance expensive wedding rituals that put families into debt. They believe that culture is a living process, and that those habits which no longer serve people will inevitably be replaced by new ones.

In my opinion, neither extreme is satisfactory. Communities should preserve what is meaningful and **authentic**, such as language, music, cuisine and craftsmanship, while being free to adapt or drop practices that cause hardship or exclude others. Education and museums can document everything, so that nothing is lost completely.

In conclusion, tradition should be protected where it enriches life, but it should not prevent a society from developing in ways that its members consider beneficial.`,
    vocab: [
      v('cultural identity', 'n', 'madaniy o‘zlik', 'the feeling of belonging to a particular culture', 'Language is a key part of cultural identity.'),
      v('globalisation', 'n', 'globallashuv', 'the spread of ideas, business and culture across the world', 'Globalisation has made many cities look alike.'),
      v('customs', 'n', 'urf-odatlar', 'traditional ways of behaving in a society', 'Wedding customs differ between regions.'),
      v('generation gap', 'n', 'avlodlar o‘rtasidagi tafovut', 'differences in attitudes between young and old', 'The generation gap can cause arguments at home.'),
      v('pass down', 'phrasal verb', 'avloddan avlodga o‘tkazmoq', 'to give knowledge or objects to younger generations', 'Grandparents often pass down old recipes.'),
      v('authentic', 'adj', 'asl, haqiqiy (soxta emas)', 'genuine and true to its origin', 'Tourists want authentic local food.'),
      v('revive', 'v', 'qayta jonlantirmoq', 'to bring something back to life or use', 'Volunteers hope to revive the old pottery tradition.', 'C1'),
      v('folklore', 'n', 'xalq og‘zaki ijodi', 'traditional stories, songs and beliefs of a community', 'Folklore tells us how ancestors saw the world.', 'C1'),
    ],
  },
  {
    id: 'health', title: 'Sog‘liq va sport', type: 'evaluate',
    about: 'Shakar solig‘i, sog‘liqni saqlash xarajatlari, turmush tarzi.',
    prompt: 'Several governments have introduced a tax on sugary drinks in order to improve public health. Do the advantages of this policy outweigh the disadvantages?',
    outline: ['Kirish', 'Afzalliklar: iste‘mol kamayadi, byudjet', 'Kamchiliklar: kam ta‘minlanganlarga zarba', 'Xulosa: afzallik og‘irroq'],
    essay: `Taxing sugary drinks has become a popular measure among health officials who are worried about rising obesity and diabetes. Although the policy has some drawbacks, I believe that its advantages are greater.

The main benefit is a reduction in sugar **consumption**. When the price of soft drinks increases, people buy fewer of them, and manufacturers have a strong reason to reduce the sugar in their products. Experience in several countries suggests that this has led to measurable improvements. Since many serious illnesses are **preventable** through a healthier **lifestyle**, lower sugar intake can reduce long-term **healthcare costs**. The revenue collected can also be spent on **public health** programmes, such as school meals and sport facilities, which multiplies the positive effect.

On the other hand, critics raise legitimate objections. A **sugar tax** may be **regressive**, in that it affects low-income families more strongly because they spend a larger proportion of their income on food and drink. Some consumers may simply switch to other unhealthy products, so the overall effect on health could be smaller than expected. There is also a concern that such taxes are intrusive, since they attempt to control personal choices.

Even so, these problems can be reduced. Governments can use part of the income to subsidise healthy food for poorer households, and they can monitor the market to prevent harmful substitutes from replacing sugary drinks. Since eating habits are formed early, education campaigns can encourage **moderation** without removing individual freedom.

In conclusion, a tax on sugary drinks has some disadvantages, but it is an effective way of improving health, and the benefits outweigh the costs if the measure is applied carefully.`,
    vocab: [
      v('public health', 'n', 'jamoat salomatligi', 'the health of a whole community', 'Clean water is vital for public health.'),
      v('sugar tax', 'n', 'shakar solig‘i', 'a tax on drinks or food with a lot of sugar', 'A sugar tax raises the price of fizzy drinks.'),
      v('preventable', 'adj', 'oldini olsa bo‘ladigan', 'able to be stopped before it happens', 'Many heart diseases are preventable.'),
      v('healthcare costs', 'n', 'sog‘liqni saqlash xarajatlari', 'money spent on medical services', 'Healthcare costs rise as populations age.'),
      v('consumption', 'n', 'iste‘mol (hajmi)', 'the amount of something that people use or eat', 'Sugar consumption has doubled in thirty years.'),
      v('regressive', 'adj', 'kam ta‘minlanganlarga og‘irroq tushadigan (soliq)', 'affecting poorer people more than richer people', 'A regressive tax harms low-income families most.', 'C1'),
      v('lifestyle', 'n', 'turmush tarzi', 'the way a person lives', 'An active lifestyle protects the heart.'),
      v('moderation', 'n', 'me‘yorni saqlash', 'avoiding extremes, especially in eating or drinking', 'Sweets are fine in moderation.', 'C1'),
    ],
  },
  {
    id: 'global', title: 'Global muammolar', type: 'problem',
    about: 'Migratsiya, malakali kadrlar oqimi, rivojlanayotgan mamlakatlar, turmush darajasi.',
    prompt: 'Many skilled workers leave poorer countries to find better jobs abroad. What problems does this cause for their home countries, and what can be done about it?',
    outline: ['Kirish', 'Muammolar: kadr tanqisligi, xizmatlar sifati', 'Yechimlar: maosh, investitsiya, qaytish dasturlari', 'Xulosa'],
    essay: `In an interconnected world, doctors, engineers and teachers can easily seek work in wealthier countries. While this benefits the individuals concerned, it creates difficulties for the countries they leave. Several measures could limit the damage.

The most serious problem is the loss of expertise, often called **brain drain**. Poorer countries spend considerable public money on training **skilled workers**, but they lose the benefit of that investment when graduates **emigrate**. The resulting **shortage** of professionals, particularly in healthcare and education, reduces the quality of services and slows economic growth. A second problem is that communities left behind may become dependent on **remittances**, money sent home by relatives abroad, which supports families but does not create new businesses or jobs.

Governments of **developing countries** can take action in several ways. Raising salaries and improving working conditions would make staying more attractive, although this requires funds that many states lack. Therefore, it is also important to **invest in** industries and research centres that offer interesting careers at home. In addition, wealthier countries could share responsibility by paying for the training of foreign professionals or by supporting programmes that allow workers to return after a few years with new experience. Finally, schemes that offer emigrants favourable terms to start businesses at home could convert part of the lost talent into an asset and gradually raise **living standards**.

In conclusion, the departure of skilled workers harms the countries that need them most, but better pay, investment in local opportunities and international cooperation can reduce the problem and benefit both sides.`,
    vocab: [
      v('brain drain', 'n', 'malakali kadrlar chiqib ketishi', 'the loss of educated people who move to other countries', 'Brain drain weakens hospitals in poorer countries.', 'C1'),
      v('skilled workers', 'n', 'malakali ishchilar', 'employees with special training', 'Factories need skilled workers.'),
      v('emigrate', 'v', 'chet elga ko‘chib ketmoq', 'to leave your own country to live in another', 'Many graduates emigrate after finishing university.'),
      v('shortage', 'n', 'tanqislik', 'a situation in which there is not enough of something', 'There is a shortage of nurses in rural areas.'),
      v('remittances', 'n', 'chet eldan yuborilgan pul o‘tkazmalari', 'money that workers abroad send home', 'Remittances are a major source of income for some families.', 'C1'),
      v('developing countries', 'n', 'rivojlanayotgan mamlakatlar', 'poorer nations with growing economies', 'Developing countries often lack modern hospitals.'),
      v('living standards', 'n', 'turmush darajasi', 'the level of comfort and wealth of a population', 'Living standards have risen steadily.'),
      v('invest in', 'phrasal verb', 'ga sarmoya kiritmoq', 'to put money into something to make it grow', 'Governments should invest in public transport.'),
    ],
  },
  {
    id: 'city', title: 'Shaharlar va transport', type: 'agree',
    about: 'Shahar markazida mashinalarni cheklash, jamoat transporti, havo sifati.',
    prompt: 'Some people think that private cars should be banned from city centres. To what extent do you agree or disagree?',
    outline: ['Kirish: asosan qo‘shilaman', '1-sabab: havo va xavfsizlik', '2-sabab: jamoat transporti iqtisodi, qarshi fikr', 'Xulosa'],
    essay: `Traffic jams, noise and pollution make many city centres unpleasant places to live and work. For this reason, some people propose a complete ban on private cars in the centre. I agree with this idea to a large extent, provided that reliable alternatives are available.

The strongest argument for a ban is the improvement in **air quality**. Cars burning petrol or diesel are a major source of harmful gases, and children and older residents suffer most from the resulting breathing problems. When Oslo and several Spanish cities limited vehicles in their historic districts, pollution fell noticeably and streets became safer and quieter. Furthermore, space previously used for parking can be converted into parks and squares, and this encourages walking, a **cycle lane** network and local shopping. Fewer vehicles also mean less **congestion**, so buses and delivery vans move faster.

Opponents argue that a ban would be unfair to disabled people, to shop owners and to those who live far from the centre. These concerns are reasonable, but they can be addressed. Exceptions could be made for emergency services, residents and people with limited mobility, while frequent, affordable **public transport** gives every **commuter** a **practical alternative**. Some cities also charge a fee for entry instead of banning cars entirely, which is a gentler way to **restrict** traffic.

In conclusion, I largely agree that private cars should be removed from **city centre** areas, since the benefits for health, safety and quality of life are considerable, as long as governments invest in public transport and make sensible exceptions.`,
    vocab: [
      v('air quality', 'n', 'havo sifati', 'how clean or polluted the air is', 'Air quality is poor near busy roads.'),
      v('cycle lane', 'n', 'velosiped yo‘lagi', 'a path for bicycles on a road', 'A new cycle lane makes commuting safer.'),
      v('public transport', 'n', 'jamoat transporti', 'buses, trains and trams used by the public', 'Public transport is cheaper than owning a car.'),
      v('commuter', 'n', 'ishga qatnovchi (har kuni)', 'a person who travels regularly to work', 'Every commuter hates delays.'),
      v('alternative', 'n', 'muqobil (variant)', 'something that can be chosen instead', 'Cycling is a healthy alternative to driving.'),
      v('restrict', 'v', 'cheklamoq', 'to limit the size or amount of something', 'Cities restrict heavy lorries in the daytime.'),
      v('city centre', 'n', 'shahar markazi', 'the middle, busiest part of a city', 'Rents in the city centre are very high.'),
      v('ban', 'v', 'qat‘iyan taqiqlamoq', 'to officially forbid something', 'Some cities ban cars on weekends.'),
    ],
  },
  {
    id: 'rural', title: 'Qishloq va qishloq xo‘jaligi', type: 'cause',
    about: 'Qishloqdan shaharga ko‘chish, dehqonchilik, oziq-ovqat xavfsizligi.',
    prompt: 'In many countries, young people are leaving the countryside to live in cities, and farming communities are shrinking. What are the causes of this trend, and what effects does it have?',
    outline: ['Kirish', 'Sabablar: ish, xizmatlar, mexanizatsiya', 'Oqibatlar: qarish, oziq-ovqat, shahar bosimi', 'Xulosa'],
    essay: `The movement of young people from villages to cities is one of the most visible social trends of our time. It has clear causes, and its effects reach both rural and urban areas.

The main reason is economic. Farming often provides an unstable income, and rural areas offer few other jobs, so ambitious young people look for better wages in cities. Another cause is the availability of **amenities**: urban areas have universities, hospitals and entertainment that many villages lack. Technological change also plays a part, since **mechanisation** has reduced the number of workers needed to produce food, and consequently some traditional **livelihood** sources have disappeared.

The consequences are significant. Most immediately, villages suffer **depopulation**, and those who remain tend to be older people, so schools and shops close and the community becomes even less attractive to families. This can threaten **food security** in the long run if too few people are willing to take up **agriculture**. Meanwhile, the cities that receive the newcomers must cope with overcrowded housing, traffic and pressure on public services, and some migrants end up in insecure jobs. At the same time, the nation may lose valuable knowledge about traditional farming methods and local ecosystems.

Finally, local governments that offer cheap loans to young farmers and reliable internet to villages could make rural life more appealing.

To conclude, young people **migrate** to cities mainly because of limited opportunities and services in the countryside, and the result is ageing villages, possible food problems and strained cities. Addressing the causes by improving rural infrastructure and income would benefit the whole country.`,
    vocab: [
      v('rural', 'adj', 'qishloq (hududiga oid)', 'relating to the countryside', 'Rural schools often have few teachers.'),
      v('agriculture', 'n', 'qishloq xo‘jaligi', 'the science and practice of farming', 'Agriculture employs many people in poorer countries.'),
      v('migrate', 'v', 'ko‘chib o‘tmoq (ish yoki yashash uchun)', 'to move from one area to another', 'Many young people migrate to the capital.'),
      v('livelihood', 'n', 'tirikchilik manbai', 'the way a person earns money to live', 'Fishing is the main livelihood of the village.', 'C1'),
      v('mechanisation', 'n', 'mexanizatsiya', 'the use of machines to do work', 'Mechanisation has reduced the need for labourers.', 'C1'),
      v('depopulation', 'n', 'aholining kamayib ketishi', 'a fall in the number of people living in an area', 'Depopulation threatens many mountain villages.', 'C1'),
      v('food security', 'n', 'oziq-ovqat xavfsizligi', 'having reliable access to enough food', 'Climate change puts food security at risk.'),
      v('amenities', 'n', 'qulayliklar (xizmatlar)', 'useful facilities such as shops and clinics', 'The town has good amenities.'),
    ],
  },
  {
    id: 'government', title: 'Davlat va qonun', type: 'discuss',
    about: 'Jazo va reabilitatsiya, jinoyatchilik, jamiyatga qaytish.',
    prompt: 'Some people believe that the main purpose of prison is to punish criminals, while others think it should be to rehabilitate them. Discuss both views and give your own opinion.',
    outline: ['Kirish', 'Jazo tarafdorlari: adolat, to‘xtatuvchi', 'Reabilitatsiya tarafdorlari: qayta jinoyat kamayadi', 'Xulosa: aralash yondashuv'],
    essay: `Prisons exist to protect society, but experts disagree about their purpose. Some people want offenders to suffer **punishment** for what they have done, whereas others believe that the main aim should be to change their behaviour. I think that both aims matter, although reform deserves greater emphasis.

Supporters of punishment argue that justice requires wrongdoers to face consequences. A harsh **sentence** may also act as a **deterrent**, discouraging potential offenders from breaking the law, and it gives victims a feeling that the system treats them fairly. Moreover, keeping dangerous people in prison clearly protects the public, at least while they are locked up. From this perspective, an overly soft approach would damage trust in the legal system and might raise the **crime rate**.

Advocates of **rehabilitation**, on the other hand, point out that most prisoners eventually return to society. If they leave prison without education, skills or support, they are likely to **reoffend**, which means more victims and higher costs. Programmes that offer literacy classes, vocational training and psychological help can help ex-prisoners to **reintegrate** and become **law-abiding** citizens. Countries such as Norway, which focus on reform, have recorded much lower levels of repeat crime. Since overcrowded prisons are expensive to maintain, reducing the **prison population** through effective rehabilitation also saves public money.

In my view, serious crimes must still be punished, but a sentence that ignores rehabilitation fails to protect society in the long term. A balanced system, in which punishment is proportionate and training is compulsory, offers the best results.

In conclusion, although punishment has a role, rehabilitation is the more effective way to reduce crime and should therefore be the main priority of prisons.`,
    vocab: [
      v('punishment', 'n', 'jazolash (jazo choralari)', 'something unpleasant done to someone who has broken a rule', 'The punishment for theft should be fair.'),
      v('sentence', 'n', 'sud hukmi', 'the punishment given by a court', 'The judge gave him a long sentence.'),
      v('deterrent', 'n', 'to‘xtatuvchi omil', 'something that makes people less likely to do something', 'Cameras are a deterrent to theft.', 'C1'),
      v('crime rate', 'n', 'jinoyatchilik darajasi', 'how often crimes happen in an area', 'The crime rate has fallen in recent years.'),
      v('reoffend', 'v', 'qayta jinoyat qilmoq', 'to commit another crime after being punished', 'Many prisoners reoffend within two years.', 'C1'),
      v('reintegrate', 'v', 'jamiyatga qaytarmoq', 'to help someone become part of society again', 'Training helps ex-prisoners reintegrate.', 'C1'),
      v('law-abiding', 'adj', 'qonunga rioya qiluvchi', 'always obeying the law', 'Most citizens are law-abiding.'),
      v('prison population', 'n', 'qamoqxonadagi mahbuslar soni', 'the number of people held in prisons', 'The prison population has doubled since 1990.'),
    ],
  },
];
