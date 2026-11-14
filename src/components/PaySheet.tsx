import { Check, Clock, Copy, CreditCard, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PLANS } from '../config';
import { getAccount, type Account } from '../lib/account';
import { confetti, sfx } from '../lib/fx';
import { PAY_EVENT, createPayment, fmtSum, openPaymentId, payCancel, payConfig, payStatus, refreshEntitlements, rememberOpen, type PayView } from '../lib/pay';
import type { TrackId } from '../lib/types';
import { BRAND } from '../brand';
import { JoinForm } from './JoinForm';

type Stage = 'account' | 'creating' | 'pending' | 'success' | 'ended' | 'error';

async function copy(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    try { const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
  }
}
const groupCard = (c: string) => c.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');

/** Kartaga o'tkazma orqali to'lov oynasi: aniq summa, karta, 5 daqiqalik taymer va holatni kuzatish. */
export function PaySheet() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('creating');
  const [want, setWant] = useState<{ track: TrackId; days: number } | null>(null);
  const [pay, setPay] = useState<PayView | null>(null);
  const [err, setErr] = useState('');
  const [left, setLeft] = useState(0);
  const [note, setNote] = useState('');
  const deadline = useRef(0);

  const begin = useCallback(async (w: { track: TrackId; days: number }) => {
    setErr(''); setStage('creating');
    try {
      const v = await createPayment(w.track, w.days);
      rememberOpen(v.id); setPay(v); deadline.current = Date.now() + v.expires_in * 1000; setLeft(v.expires_in); setStage('pending');
    } catch (e) { setErr((e as Error).message); setStage('error'); }
  }, []);

  useEffect(() => {
    const on = (e: Event) => {
      const w = (e as CustomEvent<{ track: TrackId; days: number }>).detail;
      setWant(w); setOpen(true); setPay(null); setNote('');
      if (!getAccount()) setStage('account'); else void begin(w);
    };
    window.addEventListener(PAY_EVENT, on);
    return () => window.removeEventListener(PAY_EVENT, on);
  }, [begin]);

  // Sahifa qayta ochilganda tugallanmagan to'lovni tiklaymiz
  useEffect(() => {
    const id = openPaymentId();
    if (!id || !getAccount()) return;
    void payConfig().then(async (c) => {
      if (!c.enabled) return;
      try {
        const v = await payStatus(id);
        if (v.status === 'pending' || v.status === 'prepared') { setPay(v); deadline.current = Date.now() + v.expires_in * 1000; setLeft(v.expires_in); setStage('pending'); setOpen(true); }
        else { rememberOpen(null); if (v.status === 'success') void refreshEntitlements(); }
      } catch { rememberOpen(null); }
    });
  }, []);

  // Taymer
  useEffect(() => {
    if (stage !== 'pending') return undefined;
    const t = setInterval(() => setLeft(Math.max(0, Math.round((deadline.current - Date.now()) / 1000))), 1000);
    return () => clearInterval(t);
  }, [stage]);

  // Holatni kuzatish (Hamyon bilan server o'zi ham tekshiradi: yo'qolgan callback to'lovni to'xtatmaydi)
  useEffect(() => {
    if (stage !== 'pending' || !pay) return undefined;
    let stop = false;
    const tick = async () => {
      try {
        const v = await payStatus(pay.id);
        if (stop) return;
        if (v.status === 'success') { setStage('success'); rememberOpen(null); sfx('level'); confetti(80); void refreshEntitlements(); }
        else if (v.status === 'cancelled' || v.status === 'expired' || v.status === 'failed') { setStage('ended'); rememberOpen(null); }
      } catch { /* tarmoq: keyingi urinish */ }
    };
    const t = setInterval(() => void tick(), 4000);
    void tick();
    return () => { stop = true; clearInterval(t); };
  }, [stage, pay]);

  if (!open) return null;
  const plan = want ? PLANS.find((p) => p.id === (pay?.track ?? want.track)) : null;
  const close = () => { if (stage === 'pending') setNote('To‘lov fonda kuzatiladi: o‘tkazma qilsangiz, obuna avtomatik yoqiladi.'); setOpen(false); };
  const cancel = async () => {
    if (!pay || !window.confirm('To‘lovni bekor qilasizmi?')) return;
    try { await payCancel(pay.id); } catch { /* */ }
    rememberOpen(null); setStage('ended');
  };
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');

  return (
    <div className="paysheet-wrap" role="dialog" aria-modal="true" aria-label="To‘lov">
      <div className="paysheet-back" onClick={close} />
      <div className="paysheet">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{stage === 'success' ? 'To‘lov qabul qilindi' : stage === 'ended' ? 'To‘lov yakunlandi' : `${plan?.title ?? 'Obuna'}: to‘lov`}</h3>
          <button className="icon-btn" aria-label="Yopish" onClick={close}><X size={18} /></button>
        </div>

        {stage === 'account' && want && (
          <div>
            <p className="evidence">Obuna hisobingizga bog‘lanadi. Avval laqab tanlang (parol shart emas).</p>
            <JoinForm text="Laqabingiz hisob vazifasini bajaradi. Keyin Profilda “hisob kodi”ni saqlab qo‘ying: boshqa qurilmada obunani shu kod bilan tiklaysiz." onJoined={(_a: Account) => void begin(want)} />
          </div>
        )}

        {stage === 'creating' && <p className="center"><Loader2 className="spin" size={22} /> To‘lov tayyorlanmoqda…</p>}

        {stage === 'error' && (
          <div className="center">
            <p className="notice">{err}</p>
            <div className="row" style={{ justifyContent: 'center' }}>{want && <button className="btn primary" onClick={() => void begin(want)}>Qayta urinish</button>}<button className="btn" onClick={() => setOpen(false)}>Yopish</button></div>
          </div>
        )}

        {stage === 'pending' && pay && (
          <div className="pay-body">
            <button className="pay-amount" onClick={async () => { if (await copy(String(pay.pay_amount))) setNote('Summa nusxalandi'); }}>
              <small>O‘tkazish summasi</small>
              <span><span><b>{fmtSum(pay.pay_amount ?? pay.amount)}</b> so‘m</span><Copy size={18} /></span>
            </button>
            <p className="pay-exact">Aynan shu summani o‘tkazing{pay.pay_amount && pay.pay_amount !== pay.amount ? ` (asl narxdan ${fmtSum(pay.pay_amount - pay.amount)} so‘m farq tizim to‘lovni aniqlashi uchun kerak)` : ''}. Boshqa summa tanilmaydi.</p>
            <button className="pay-card" onClick={async () => { if (pay.card && await copy(pay.card.replace(/\s+/g, ''))) setNote('Karta raqami nusxalandi'); }}>
              <small><CreditCard size={14} /> Karta raqami</small>
              <span><b>{pay.card ? groupCard(pay.card) : '—'}</b><Copy size={18} /></span>
            </button>
            <div className={`pay-timer ${left < 60 ? 'low' : ''}`}><Clock size={16} /> Qolgan vaqt: <b>{mm}:{ss}</b></div>
            <ol className="pay-steps">
              <li>Banking ilovangizda “kartaga o‘tkazma”ni oching.</li>
              <li>Yuqoridagi karta va summani kiriting (nusxalash uchun bosing).</li>
              <li>O‘tkazma qilingach, obuna bir necha soniyada o‘zi yoqiladi.</li>
            </ol>
            <p className="evidence"><Loader2 className="spin" size={14} /> To‘lov kutilmoqda…</p>
            <div className="row"><button className="btn" onClick={cancel}>Bekor qilish</button><button className="btn" onClick={close}>Yopish (fonda kuzatiladi)</button></div>
          </div>
        )}

        {stage === 'success' && (
          <div className="center">
            <span className="paid-ico"><Check size={34} /></span>
            <p>Obunangiz yoqildi{pay ? ` (${pay.days === 30 ? '1 oy' : `${pay.days / 30} oy`})` : ''}. Omad!</p>
            <button className="btn primary" onClick={() => setOpen(false)}>Davom etish</button>
          </div>
        )}

        {stage === 'ended' && (
          <div className="center">
            <p>To‘lov amalga oshmadi yoki muddati tugadi. Agar pulni o‘tkazgan bo‘lsangiz, bir necha daqiqa kuting: tizim uni avtomatik tekshiradi. Obuna yoqilmasa, yordam so‘rang: {BRAND.contact}</p>
            <div className="row" style={{ justifyContent: 'center' }}>{want && <button className="btn primary" onClick={() => void begin(want)}>Qayta to‘lash</button>}<button className="btn" onClick={() => setOpen(false)}>Yopish</button></div>
          </div>
        )}
        {note && <p className="evidence center">{note}</p>}
      </div>
    </div>
  );
}
