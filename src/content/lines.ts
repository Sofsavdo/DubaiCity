// Mascot gaplari. Qattiq rejim: hazil-roast, faqat xatoga qaratilgan; so'kinish, oila, din, millat haqida haqorat yo'q.
export const lines = {
  correct: {
    soft: ['Zo‘r!', 'To‘g‘ri!', 'Barakalla!', 'Ana xolos!'],
    hard: ['Ho‘sh, miyang ishlayapti ekan.', 'Tasodifmi? Yana bitta!', 'Mayli, shu safar ma‘qullayman.'],
  },
  wrong: {
    soft: ['Hechqisi yo‘q, davom eting.', 'Deyarli! Yana urinib ko‘ring.', 'Xato qilish o‘rganishning bir qismi.'],
    hard: ['Bu so‘zni uchinchi marta ko‘rib turibsan-ku!', 'Lug‘at senga qarab yig‘layapti.', 'Bandi ko‘zini yumib oldi.', 'Xato! Yana shunday qilsang, daftarga yozib qo‘yaman.'],
  },
  combo: ['Seriya! Davom et!', 'To‘xtovsiz!', 'Olov bo‘ldi!'],
  end: {
    good: ['Ajoyib natija!', 'Bugun zo‘r ishladingiz!'],
    ok: ['Yomon emas. Yana bir urinib ko‘ramizmi?', 'Yaxshi boshlanish.'],
    bad: ['Bugun qiyin bo‘ldi. Ertaga yana urinamiz.'],
  },
} as const;

export const pickLine = (arr: readonly string[]): string => arr[Math.floor(Math.random() * arr.length)];
