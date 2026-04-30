import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Scan, LayoutGrid, CheckCircle2, XCircle, User, Search, AlertCircle, Camera, Globe, Users, TrendingUp } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    dir: 'ltr',
    nav: { card: 'Invitation', register: 'RSVP', admin: 'Admin', scanner: 'Entry' },
    landing: {
      bismillah: 'In the Name of Allah, the Most Gracious, the Most Merciful',
      verse: 'And He placed between you affection and mercy',
      together: 'TOGETHER WITH THEIR FAMILIES',
      groomFamily: 'The Family of Mr.',
      groomName: 'Jihad Jameel Abu Shamieh', groomHouse: 'Al-Nawfal',
      brideFamily: 'The Family of Mr.',
      brideName: 'Osama Mohammad Zeidan', brideHouse: 'Al-Thabta',
      invite: 'Joyfully invite you to celebrate the marriage of',
      groom: 'Majd', bride: 'Dana',
      willing: 'By the will of Allah Almighty',
      day: 'WEDNESDAY', dateLabel: 'THE FIRST OF JULY', year: 'TWO THOUSAND AND TWENTY-SIX',
      time: '7:15 PM', venue: 'THE RITZ-CARLTON', city: 'AMMAN · JORDAN',
      childrenNotice: 'Per hotel policy, the presence of children is respectfully declined',
      rsvpTitle: 'KINDLY RESPOND', rsvpDeadline: 'BY THE SEVENTH OF MAY',
      scanPrompt: 'Scan to confirm your presence', cta: 'Confirm Attendance',
    },
    register: {
      chapter: 'RSVP', title: 'Confirm Your Presence',
      subtitle: 'We humbly request the favor of your response',
      firstName: 'First Name', familyName: 'Family Name', mobile: 'Mobile Number',
      mobileHint: 'For WhatsApp delivery of your entry pass',
      guestOf: 'I am a guest of',
      groupGroom: 'Family of the Groom (Al-Nawfal)', groupBride: 'Family of the Bride (Al-Thabta)',
      groupFriends: 'Dear Friends', groupColleagues: 'Esteemed Colleagues',
      submit: 'Confirm My Attendance', required: 'This field is required',
      invalid: 'Please enter a valid phone number', duplicate: 'This number is already registered',
      past: 'The RSVP period has now closed.',
      thankYou: 'Thank you,', sentVia: 'Your entry pass has been sent via WhatsApp to',
      yourQR: 'YOUR ENTRY PASS', yourName: 'Presented for',
      testNote: 'Please present this pass at the entrance of The Ritz-Carlton on the evening of the celebration.',
    },
    login: {
      chapter: 'ADMIN ACCESS', title: 'Administrator Login', subtitle: 'Authorized personnel only',
      username: 'Username', password: 'Password', submit: 'Sign In',
      error: 'Incorrect credentials. Please try again.', hint: 'Demo: admin · wedding2026', signOut: 'Sign Out',
    },
    admin: {
      chapter: 'REGISTRY', title: 'Guest Management',
      total: 'Registered', assigned: 'Seated', unassigned: 'Pending', attended: 'Attended',
      search: 'Search by name or number…',
      filters: { all: 'All Guests', unassigned: 'Pending', assigned: 'Seated', attended: 'Attended' },
      attendedLabel: 'PRESENT', registeredLabel: 'Registered', noMatch: 'No guests found.',
      notAssigned: 'Not assigned',
      cols: ['Guest', 'Phone', 'Party', 'Placement', 'Status', ''],
      seat: 'Assign Seat', qr: 'View Pass', selectSeat: 'Select a table and seat below', close: 'Close',
    },
    scanner: {
      chapter: 'ENTRY', title: 'Guest Reception',
      cameraLabel: 'QR SCANNER', cameraOff: 'Camera is off',
      startCamera: 'Start Camera', stopCamera: 'Stop Camera', allowHint: 'Camera permission is required',
      manualLabel: 'Manual Lookup', manualPlaceholder: 'Paste or type the guest reference code…',
      checkByID: 'Check In Guest', quickTest: 'Quick Test (Demo Guests)',
      awaiting: 'Awaiting next guest…', welcome: 'WELCOME', alreadyIn: 'ALREADY CHECKED IN',
      phone: 'Phone', group: 'Party', proceed: 'PLEASE PROCEED TO',
      table: 'Table', seat: 'Seat', noSeat: 'Please see the host for seating',
      recent: 'RECENT CHECK-INS', notFound: 'Guest not found',
      permissionDenied: 'Camera permission was denied.', noCamera: 'No camera found.',
      cantStart: 'Could not start camera',
    },
  },
  ar: {
    dir: 'rtl',
    nav: { card: 'الدعوة', register: 'التأكيد', admin: 'السجل', scanner: 'الاستقبال' },
    landing: {
      bismillah: 'بسم الله الرحمن الرحيم', verse: 'وجعل بينكم مودة ورحمة',
      together: 'بحضور عائلتيهم',
      groomFamily: 'عائلة السيد', groomName: 'جهاد جميل أبو شامية', groomHouse: 'آل نوفل',
      brideFamily: 'عائلة السيد', brideName: 'أسامة محمد زيدان', brideHouse: 'آل الثبتة',
      invite: 'يتشرفون بدعوتكم لحضور حفل زفاف',
      groom: 'مجد', bride: 'دانا',
      willing: 'وذلك بمشيئة الله تعالى',
      day: 'الأربعاء', dateLabel: 'الأول من تموز', year: 'ألفين وستة وعشرين',
      time: 'السابعة والربع مساءً', venue: 'فندق ريتز كارلتون', city: 'عمّان · الأردن',
      childrenNotice: 'حسب سياسة الفندق يمنع اصطحاب الأطفال',
      rsvpTitle: 'الرجاء تأكيد الحضور', rsvpDeadline: 'قبل السابع من أيار',
      scanPrompt: 'امسح لتأكيد حضورك', cta: 'تأكيد الحضور',
    },
    register: {
      chapter: 'تأكيد الحضور', title: 'تأكيد الحضور',
      subtitle: 'نتشرف بتلقي تأكيدكم الكريم',
      firstName: 'الاسم الأول', familyName: 'اسم العائلة', mobile: 'رقم الجوال',
      mobileHint: 'لإرسال بطاقة الدخول عبر الواتساب',
      guestOf: 'أنا ضيف',
      groupGroom: 'عائلة العريس (آل نوفل)', groupBride: 'عائلة العروس (آل الثبتة)',
      groupFriends: 'الأصدقاء الأعزاء', groupColleagues: 'الزملاء الكرام',
      submit: 'تأكيد حضوري', required: 'هذا الحقل مطلوب',
      invalid: 'الرجاء إدخال رقم هاتف صحيح', duplicate: 'هذا الرقم مسجّل مسبقاً',
      past: 'انتهت فترة تأكيد الحضور.',
      thankYou: 'مع جزيل الشكر،', sentVia: 'تم إرسال بطاقة الدخول عبر الواتساب إلى',
      yourQR: 'بطاقة الدخول', yourName: 'مُقدّمة إلى',
      testNote: 'الرجاء تقديم هذه البطاقة عند مدخل فندق ريتز كارلتون مساء الحفل.',
    },
    login: {
      chapter: 'دخول المسؤول', title: 'دخول المسؤول', subtitle: 'للمخوّلين فقط',
      username: 'اسم المستخدم', password: 'كلمة المرور', submit: 'تسجيل الدخول',
      error: 'بيانات غير صحيحة. حاول مرة أخرى.', hint: 'تجريبي: admin · wedding2026', signOut: 'تسجيل الخروج',
    },
    admin: {
      chapter: 'السجل', title: 'إدارة الضيوف',
      total: 'المسجّلون', assigned: 'المقاعد', unassigned: 'معلّق', attended: 'الحاضرون',
      search: 'ابحث بالاسم أو الرقم…',
      filters: { all: 'الكل', unassigned: 'معلّق', assigned: 'بمقعد', attended: 'حاضر' },
      attendedLabel: 'حاضر', registeredLabel: 'مسجّل', noMatch: 'لا توجد نتائج.', notAssigned: 'غير معيّن',
      cols: ['الضيف', 'الرقم', 'الجهة', 'الموقع', 'الحالة', ''],
      seat: 'تعيين مقعد', qr: 'عرض البطاقة', selectSeat: 'اختر الطاولة والمقعد', close: 'إغلاق',
    },
    scanner: {
      chapter: 'الاستقبال', title: 'استقبال الضيوف',
      cameraLabel: 'ماسح QR', cameraOff: 'الكاميرا متوقفة',
      startCamera: 'تشغيل الكاميرا', stopCamera: 'إيقاف الكاميرا', allowHint: 'يتطلب إذن الكاميرا',
      manualLabel: 'بحث يدوي', manualPlaceholder: 'أدخل الرمز المرجعي للضيف…',
      checkByID: 'تسجيل وصول الضيف', quickTest: 'اختبار سريع',
      awaiting: 'بانتظار الضيف…', welcome: 'أهلاً وسهلاً', alreadyIn: 'تم تسجيل الدخول مسبقاً',
      phone: 'الرقم', group: 'الجهة', proceed: 'الرجاء التوجه إلى',
      table: 'طاولة', seat: 'مقعد', noSeat: 'الرجاء مراجعة المضيف',
      recent: 'آخر الوافدين', notFound: 'الضيف غير موجود',
      permissionDenied: 'تم رفض إذن الكاميرا.', noCamera: 'لا توجد كاميرا.',
      cantStart: 'تعذّر تشغيل الكاميرا',
    },
  },
};

const ALLOWED_COUNTRIES = [
  { code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+970', name: 'Palestine', flag: '🇵🇸' },
  { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
];

const RSVP_DEADLINE = new Date('2026-05-07T23:59:59');
const TOTAL_TABLES = 20;
const SEATS_PER_TABLE = 10;
const generateId = () => 'xxxxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random()*16).toString(16));
const validatePhone = (cc, num) => { const c = num.replace(/\D/g,''); return c.length>=7&&c.length<=12; };

const C = {
  bg: '#fafaf7', dark: '#2d4a2d', mid: '#4a6b3a', light: '#7a9a6a',
  gold: '#b8960c', goldLight: '#d4b44a', cream: '#f5f2e8',
  border: '#d8d4c0', muted: '#6a6a58', inputBg: '#ffffff',
};

const FloralBorder = ({ position='top' }) => (
  <svg viewBox="0 0 900 180" xmlns="http://www.w3.org/2000/svg"
    style={{width:'100%',display:'block',transform:position==='bottom'?'scaleY(-1)':'none',marginBottom:position==='top'?-2:0,marginTop:position==='bottom'?-2:0}}>
    <defs>
      <radialGradient id="pg1" cx="40%" cy="40%" r="60%"><stop offset="0%" stopColor="#fff" stopOpacity=".95"/><stop offset="100%" stopColor="#e8e8e0" stopOpacity=".7"/></radialGradient>
      <radialGradient id="pg2" cx="40%" cy="40%" r="60%"><stop offset="0%" stopColor="#f5f5f0" stopOpacity=".9"/><stop offset="100%" stopColor="#d8d8ce" stopOpacity=".6"/></radialGradient>
    </defs>
    {[80,160,240,320,400,480,560,640,720,800].map((x,i)=>(
      <g key={i} transform={`translate(${x},${i%2===0?20:30})`}>
        <ellipse cx="0" cy="0" rx="32" ry="12" fill="#7a9a6a" opacity=".7" transform={`rotate(${-30+i*8})`}/>
        <ellipse cx="0" cy="0" rx="28" ry="9" fill="#9ab88a" opacity=".6" transform={`rotate(${-30+i*8})`}/>
      </g>
    ))}
    {[50,180,310,450,580,720,860].map((x,i)=>(
      <g key={i} transform={`translate(${x},${i%2===0?55:45})`}>
        {[0,51,102,153,204,255,306].map((a,j)=>(
          <ellipse key={j} cx="0" cy="-20" rx="10" ry="22" fill={j%2===0?'url(#pg1)':'url(#pg2)'} opacity=".92"
            stroke="#d0cfc8" strokeWidth=".4" transform={`rotate(${a})`}/>
        ))}
        <circle cx="0" cy="0" r="8" fill="#f0ede0" opacity=".95"/>
        <circle cx="0" cy="0" r="4" fill="#e8e0c8" opacity=".9"/>
      </g>
    ))}
    {[130,270,390,510,650,790].map((x,i)=>(
      <g key={i} transform={`translate(${x},${i%2===0?35:25})`}>
        {[0,72,144,216,288].map((a,j)=>(
          <ellipse key={j} cx="0" cy="-11" rx="5" ry="13" fill="url(#pg1)" opacity=".85"
            stroke="#d8d4c8" strokeWidth=".3" transform={`rotate(${a})`}/>
        ))}
        <circle cx="0" cy="0" r="4" fill="#f0ede0" opacity=".9"/>
      </g>
    ))}
  </svg>
);

const RealQRCode = ({ value, size=200 }) => {
  const [svg,setSvg] = useState(null);
  useEffect(()=>{
    const gen = async () => {
      try {
        if(!window.qrcode){
          await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s);});
        }
        const qr=window.qrcode(0,'M');qr.addData(value);qr.make();
        const count=qr.getModuleCount();const cell=size/count;
        let rects='';
        for(let r=0;r<count;r++) for(let c=0;c<count;c++)
          if(qr.isDark(r,c)) rects+=`<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}" fill="#2d4a2d"/>`;
        setSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#fff"/>${rects}</svg>`);
      } catch(e){ setSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#f5f5f0"/><text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="12">QR</text></svg>`); }
    };
    gen();
  },[value,size]);
  if(!svg) return <div style={{width:size,height:size,background:'#f5f5f0',display:'flex',alignItems:'center',justifyContent:'center',color:'#999',fontSize:13}}>…</div>;
  return <div dangerouslySetInnerHTML={{__html:svg}}/>;
};

export default function WeddingRSVP() {
  const [view,setView] = useState('landing');
  const [lang,setLang] = useState('ar');
  const t = TRANSLATIONS[lang];
  const [guests,setGuests] = useState([
    {id:'ahmad01',firstName:'Ahmad',familyName:'Al-Hassan',countryCode:'+962',mobile:'791234567',fullPhone:'+962791234567',seatNumber:3,tableNumber:5,group:'Family of the Groom · Al-Nawfal',registeredAt:new Date().toISOString(),checkedInAt:null},
    {id:'layla02',firstName:'Layla',familyName:'Nasser',countryCode:'+962',mobile:'799876543',fullPhone:'+962799876543',seatNumber:null,tableNumber:null,group:'Family of the Bride · Al-Thabta',registeredAt:new Date().toISOString(),checkedInAt:null},
  ]);
  const addGuest = g => setGuests(p=>[...p,g]);
  const updateGuest = (id,u) => setGuests(p=>p.map(g=>g.id===id?{...g,...u}:g));

  const navItems = [{id:'landing',label:t.nav.card},{id:'register',label:t.nav.register},{id:'admin',label:t.nav.admin},{id:'scanner',label:t.nav.scanner}];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cinzel:wght@400;500;600&family=Great+Vibes&family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:${C.bg};}
    .serif{font-family:'Cormorant Garamond',Georgia,serif;}
    .script{font-family:'Great Vibes',cursive;}
    .cinzel{font-family:'Cinzel',serif;}
    .ar-d{font-family:'Aref Ruqaa','Amiri',serif;}
    .ar-b{font-family:'Reem Kufi','Amiri',serif;}
    .ital{font-family:'Cormorant Garamond',serif;font-style:italic;}

    /* ── Form inputs – large, boxed, very readable ── */
    .field-wrap{display:flex;flex-direction:column;gap:8px;}
    .field-label{font-family:'Cinzel',serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${C.mid};font-weight:500;}
    .field-label-ar{font-family:'Reem Kufi',serif;font-size:14px;letter-spacing:0;color:${C.mid};font-weight:600;}
    .input-box{width:100%;padding:16px 20px;border:1.5px solid ${C.border};border-radius:4px;background:${C.inputBg};font-family:'Cormorant Garamond',serif;font-size:20px;color:${C.dark};outline:none;transition:border-color .25s,box-shadow .25s;line-height:1.3;}
    .input-box:focus{border-color:${C.dark};box-shadow:0 0 0 3px rgba(45,74,45,.1);}
    .input-box::placeholder{color:#bbb;font-style:italic;font-size:18px;}
    .input-box.ar-b{font-family:'Reem Kufi',serif;font-size:18px;}
    select.input-box{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath d='M1 4L6 9L11 4' stroke='%234a6b3a' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:40px;}
    [dir=rtl] select.input-box{background-position:left 16px center;padding-right:20px;padding-left:40px;}
    .field-error{font-family:'Cormorant Garamond',serif;font-size:15px;color:#b91c1c;font-style:italic;padding:6px 0;}
    .field-hint{font-family:'Cormorant Garamond',serif;font-size:15px;color:${C.muted};font-style:italic;}
    .field-hint-ar{font-family:'Reem Kufi',serif;font-size:14px;color:${C.muted};}

    /* Buttons */
    .btn-p{background:${C.dark};color:#fff;padding:18px 40px;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:13px;letter-spacing:.2em;transition:background .3s;border-radius:3px;}
    .btn-p:hover{background:${C.mid};}
    .btn-p:disabled{background:#ccc;cursor:not-allowed;}
    .btn-p-ar{font-family:'Reem Kufi',serif;font-size:16px;letter-spacing:0;}
    .btn-s{background:transparent;color:${C.dark};border:1.5px solid ${C.dark};padding:16px 36px;cursor:pointer;font-family:'Cinzel',serif;font-size:12px;letter-spacing:.18em;transition:all .3s;border-radius:3px;}
    .btn-s:hover{background:${C.dark};color:#fff;}

    /* Nav link */
    .nav-btn{background:transparent;border:none;cursor:pointer;font-family:'Cinzel',serif;letter-spacing:.18em;font-size:12px;padding-bottom:4px;transition:all .3s;}

    /* Table rows */
    tr:hover td{background:rgba(122,154,106,.07);}

    /* Admin action links */
    .act-link{background:none;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;letter-spacing:.12em;color:${C.mid};text-decoration:underline;text-underline-offset:3px;padding:4px 0;}
    .act-link:hover{color:${C.dark};}

    /* Gold divider */
    .gold-line{height:1px;background:linear-gradient(90deg,transparent,${C.gold},${C.gold},transparent);}
    .gold-s{width:64px;height:1px;background:${C.gold};margin:0 auto;}

    /* Animations */
    @keyframes fi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    .fi{animation:fi .7s ease both;}
    .fi1{animation:fi .6s .1s ease both;}
    .fi2{animation:fi .6s .22s ease both;}
    .fi3{animation:fi .6s .38s ease both;}
    .fi4{animation:fi .6s .52s ease both;}
    .fi5{animation:fi .6s .66s ease both;}

    /* Card */
    .card{background:#fff;border:1px solid ${C.border};padding:40px;}
    .card-sm{background:#fff;border:1px solid ${C.border};padding:28px 32px;}
  `;

  return (
    <div dir={t.dir} style={{minHeight:'100vh',background:C.bg,color:C.dark}}>
      <style>{css}</style>

      {/* ── Nav ── */}
      <nav style={{background:'#fff',borderBottom:`1px solid ${C.border}`,padding:'18px 28px',position:'sticky',top:0,zIndex:50,boxShadow:'0 1px 8px rgba(0,0,0,.05)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:46,height:46,border:`1.5px solid ${C.gold}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg}}>
              <span className="script" style={{fontSize:26,color:C.dark,lineHeight:1}}>M<span style={{color:C.gold,fontSize:20}}>&</span>D</span>
            </div>
            <div>
              <div className="cinzel" style={{fontSize:12,color:C.mid,letterSpacing:'.2em'}}>MAJD · DANA</div>
              <div className="ital" style={{fontSize:13,color:C.muted}}>01 · 07 · MMXXVI</div>
            </div>
          </div>
          <div style={{display:'flex',gap:24,alignItems:'center',flexWrap:'wrap'}}>
            {navItems.map((item,i)=>(
              <button key={item.id} onClick={()=>setView(item.id)} className="nav-btn"
                style={{color:view===item.id?C.dark:C.muted,fontWeight:view===item.id?600:400,borderBottom:view===item.id?`2px solid ${C.dark}`:'2px solid transparent'}}>
                {lang==='ar'
                  ? <span className="ar-b" style={{fontSize:14,letterSpacing:0}}>{item.label}</span>
                  : `${String(i+1).padStart(2,'0')} · ${item.label}`}
              </button>
            ))}
            <button onClick={()=>setLang(l=>l==='en'?'ar':'en')}
              style={{background:'transparent',color:C.mid,border:`1px solid ${C.gold}`,padding:'6px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:6,borderRadius:3}}>
              <Globe size={13} color={C.gold}/>
              <span className="cinzel" style={{fontSize:11,letterSpacing:'.1em'}}>{lang==='en'?'عربي':'EN'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'52px 24px 80px'}}>
        {view==='landing'&&<LandingView t={t} lang={lang} onRegister={()=>setView('register')} />}
        {view==='register'&&<RegistrationView t={t} lang={lang} guests={guests} addGuest={addGuest} />}
        {view==='admin'&&<AdminView t={t} lang={lang} guests={guests} updateGuest={updateGuest} />}
        {view==='scanner'&&<ScannerView t={t} lang={lang} guests={guests} updateGuest={updateGuest} />}
      </div>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:'28px',textAlign:'center',background:'#fff'}}>
        <div className="gold-s" style={{marginBottom:14}}></div>
        <div className="script" style={{fontSize:30,color:C.dark}}>Majd <span style={{color:C.gold}}>&</span> Dana</div>
        <div className="cinzel" style={{fontSize:11,color:C.muted,marginTop:6,letterSpacing:'.2em'}}>THE RITZ-CARLTON · AMMAN · MMXXVI</div>
      </footer>
    </div>
  );
}

/* ──────────────────────────── LANDING ──────────────────────────── */
function LandingView({ t, lang, onRegister }) {
  const isAr = lang==='ar';
  return (
    <div className="fi" style={{position:'relative'}}>
      <div style={{maxWidth:640,margin:'0 auto',position:'relative'}}>
        <div style={{position:'absolute',inset:0,border:`1px solid ${C.gold}`,pointerEvents:'none',zIndex:1}}></div>
        <div style={{position:'absolute',inset:7,border:`1px solid ${C.border}`,pointerEvents:'none',zIndex:1}}></div>
        <div style={{background:'#fff',position:'relative',zIndex:2}}>
          <FloralBorder position="top"/>
          <div style={{padding:'28px 52px 48px',textAlign:'center'}}>

            {/* Bismillah */}
            <div className="fi1" style={{marginBottom:20}}>
              {isAr
                ? <div className="ar-d" style={{fontSize:24,color:C.dark,lineHeight:1.7}}>﷽</div>
                : <div className="ital" style={{fontSize:15,color:C.mid,letterSpacing:'.03em'}}>{t.landing.bismillah}</div>}
            </div>

            {/* Verse */}
            <div className="fi1" style={{marginBottom:24}}>
              {isAr
                ? <div className="ar-d" style={{fontSize:27,color:C.dark,fontWeight:700,lineHeight:1.7}}>﴿ {t.landing.verse} ﴾</div>
                : <div className="ital" style={{fontSize:17,color:C.dark,lineHeight:1.7,maxWidth:380,margin:'0 auto'}}>"{t.landing.verse}"</div>}
            </div>

            <div className="fi2 gold-s" style={{marginBottom:24}}></div>

            {/* Together */}
            <div className="fi2" style={{marginBottom:20}}>
              {isAr
                ? <div className="ar-b" style={{fontSize:16,color:C.mid}}>{t.landing.together}</div>
                : <div className="cinzel" style={{fontSize:11,color:C.mid,letterSpacing:'.2em'}}>{t.landing.together}</div>}
            </div>

            {/* Two families */}
            <div className="fi2" style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:16,alignItems:'center',marginBottom:28}}>
              {[['groomFamily','groomName','groomHouse'],['brideFamily','brideName','brideHouse']].map((keys,idx)=>(
                <React.Fragment key={idx}>
                  {idx===1&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                    <div style={{width:1,height:28,background:C.gold}}></div>
                    <div className="serif" style={{fontSize:20,color:C.gold}}>&</div>
                    <div style={{width:1,height:28,background:C.gold}}></div>
                  </div>}
                  <div style={{textAlign:'center'}}>
                    {isAr
                      ? <>
                          <div className="ar-b" style={{fontSize:13,color:C.mid,marginBottom:4}}>{t.landing[keys[0]]}</div>
                          <div className="ar-d" style={{fontSize:18,color:C.dark,fontWeight:700,lineHeight:1.5}}>{t.landing[keys[1]]}</div>
                          <div className="ar-d" style={{fontSize:15,color:C.gold,marginTop:2}}>{t.landing[keys[2]]}</div>
                        </>
                      : <>
                          <div className="cinzel" style={{fontSize:9,color:C.mid,letterSpacing:'.15em',marginBottom:4}}>{t.landing[keys[0]]}</div>
                          <div className="serif" style={{fontSize:17,color:C.dark,lineHeight:1.3}}>{t.landing[keys[1]]}</div>
                          <div className="ital" style={{fontSize:14,color:C.gold,marginTop:2}}>{t.landing[keys[2]]}</div>
                        </>}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Invite line */}
            <div className="fi3" style={{marginBottom:24}}>
              {isAr
                ? <div className="ar-b" style={{fontSize:17,color:C.dark,lineHeight:1.8}}>{t.landing.invite}</div>
                : <div className="ital" style={{fontSize:16,color:C.dark,lineHeight:1.7}}>{t.landing.invite}</div>}
            </div>

            {/* Names */}
            <div className="fi3" style={{margin:'28px 0'}}>
              {isAr
                ? <div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:20}}>
                    <div className="ar-d" style={{fontSize:84,color:C.dark,lineHeight:1,fontWeight:400}}>{t.landing.groom}</div>
                    <div className="ar-d" style={{fontSize:42,color:C.gold,lineHeight:1}}>و</div>
                    <div className="ar-d" style={{fontSize:84,color:C.dark,lineHeight:1,fontWeight:400}}>{t.landing.bride}</div>
                  </div>
                : <div>
                    <div className="script" style={{fontSize:106,color:C.dark,lineHeight:.85}}>{t.landing.groom}</div>
                    <div className="script" style={{fontSize:54,color:C.gold,margin:'-4px 0',lineHeight:1}}>&</div>
                    <div className="script" style={{fontSize:106,color:C.dark,lineHeight:.85}}>{t.landing.bride}</div>
                  </div>}
            </div>

            {/* Willing */}
            <div className="fi3" style={{marginBottom:28}}>
              {isAr
                ? <div className="ar-b" style={{fontSize:16,color:C.mid}}>{t.landing.willing}</div>
                : <div className="ital" style={{fontSize:14,color:C.mid}}>{t.landing.willing}</div>}
            </div>

            <div className="fi4 gold-s" style={{marginBottom:24}}></div>

            {/* Time / Venue / Date */}
            <div className="fi4" style={{display:'grid',gridTemplateColumns:'1fr 1px 1fr 1px 1fr',marginBottom:24,border:`1px solid ${C.border}`,borderRadius:4,overflow:'hidden'}}>
              {[['🕖',t.landing.time,'TIME'],['📍',t.landing.venue,t.landing.city],['📅','1. 7. 2026','DATE']].map(([icon,main,sub],i)=>(
                <React.Fragment key={i}>
                  {i>0&&<div style={{background:C.border}}></div>}
                  <div style={{padding:'20px 12px',textAlign:'center',background:'#fafaf7'}}>
                    <div style={{fontSize:24,marginBottom:6}}>{icon}</div>
                    <div className={isAr?'ar-b':'serif'} style={{fontSize:isAr?15:17,color:C.dark,fontWeight:600,lineHeight:1.3}}>{main}</div>
                    <div className="cinzel" style={{fontSize:9,color:C.muted,marginTop:4,letterSpacing:'.12em'}}>{sub}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Children notice */}
            <div className="fi4" style={{fontSize:isAr?15:13,color:C.muted,marginBottom:28,padding:'12px 20px',border:`1px solid ${C.border}`,borderRadius:4,background:'#fafaf7',fontStyle:isAr?'normal':'italic',fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif'}}>
              {t.landing.childrenNotice}
            </div>

            {/* RSVP block */}
            <div className="fi5">
              <div className="cinzel" style={{fontSize:11,color:C.mid,marginBottom:4,letterSpacing:'.2em'}}>{t.landing.rsvpTitle}</div>
              <div style={{fontSize:isAr?15:14,color:C.muted,marginBottom:20,fontStyle:isAr?'normal':'italic',fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif'}}>{t.landing.rsvpDeadline}</div>
              <div style={{border:`1px solid ${C.border}`,display:'inline-block',padding:14,background:'#fff',marginBottom:12,borderRadius:4}}>
                <RealQRCode value="https://yourwedding.com/register" size={140}/>
              </div>
              <div style={{fontSize:isAr?14:13,color:C.muted,marginBottom:24,fontStyle:isAr?'normal':'italic',fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif'}}>{t.landing.scanPrompt}</div>
              <button onClick={onRegister} className="btn-p" style={{minWidth:240,fontSize:13}}>
                {isAr?<span className="btn-p-ar">{t.landing.cta}</span>:t.landing.cta}
              </button>
            </div>
          </div>
          <FloralBorder position="bottom"/>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── REGISTRATION ──────────────────────────── */
function RegistrationView({ t, lang, guests, addGuest }) {
  const [firstName,setFirstName]=useState('');
  const [familyName,setFamilyName]=useState('');
  const [countryCode,setCountryCode]=useState('+962');
  const [mobile,setMobile]=useState('');
  const [group,setGroup]=useState('Family of the Groom · Al-Nawfal');
  const [errors,setErrors]=useState({});
  const [submitted,setSubmitted]=useState(null);
  const isPast = new Date()>RSVP_DEADLINE;
  const isAr = lang==='ar';

  const handleSubmit = () => {
    const e={};
    if(!firstName.trim()) e.firstName=t.register.required;
    if(!familyName.trim()) e.familyName=t.register.required;
    if(!mobile.trim()) e.mobile=t.register.required;
    else if(!validatePhone(countryCode,mobile)) e.mobile=t.register.invalid;
    const fp=`${countryCode}${mobile.replace(/\D/g,'')}`;
    if(guests.find(g=>g.fullPhone===fp)) e.mobile=t.register.duplicate;
    setErrors(e);
    if(Object.keys(e).length>0) return;
    const ng={id:generateId(),firstName:firstName.trim(),familyName:familyName.trim(),countryCode,mobile:mobile.replace(/\D/g,''),fullPhone:fp,seatNumber:null,tableNumber:null,group,registeredAt:new Date().toISOString(),checkedInAt:null};
    addGuest(ng);setSubmitted(ng);
  };

  if(submitted) return (
    <div className="fi" style={{maxWidth:540,margin:'40px auto',textAlign:'center'}}>
      <CheckCircle2 size={52} color={C.light} strokeWidth={1.5} style={{margin:'0 auto 20px'}}/>
      <div className={isAr?'ar-b':'ital'} style={{fontSize:isAr?20:19,color:C.mid,marginBottom:8}}>{t.register.thankYou}</div>
      <div className="script" style={{fontSize:72,color:C.dark,lineHeight:.9,marginBottom:20}}>{submitted.firstName}</div>
      <div className="gold-s" style={{marginBottom:24}}></div>
      <div style={{fontSize:isAr?16:15,color:C.muted,marginBottom:32,lineHeight:1.7,fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif',fontStyle:isAr?'normal':'italic'}}>
        {t.register.sentVia}<br/>
        <strong style={{color:C.dark,fontStyle:'normal',fontFamily:'monospace',fontSize:16}}>{submitted.fullPhone}</strong>
      </div>
      <div className="card" style={{textAlign:'center',borderColor:C.border}}>
        <div className="cinzel" style={{fontSize:12,color:C.mid,marginBottom:10,letterSpacing:'.2em'}}>{t.register.yourQR}</div>
        <div style={{fontSize:isAr?16:15,color:C.muted,marginBottom:24,fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif',fontStyle:isAr?'normal':'italic'}}>
          {t.register.yourName} · <strong style={{color:C.dark,fontStyle:'normal'}}>{submitted.firstName} {submitted.familyName}</strong>
        </div>
        <div style={{border:`1px solid ${C.border}`,display:'inline-block',padding:16,background:'#fff',marginBottom:16,borderRadius:4}}>
          <RealQRCode value={submitted.id} size={190}/>
        </div>
        <div className="gold-s" style={{marginBottom:12}}></div>
        <div style={{fontSize:12,color:C.muted,fontFamily:'monospace'}}>REF · {submitted.id}</div>
      </div>
      <div style={{fontSize:isAr?15:14,color:C.muted,marginTop:24,lineHeight:1.8,fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif',fontStyle:isAr?'normal':'italic'}}>
        {t.register.testNote}
      </div>
    </div>
  );

  return (
    <div className="fi" style={{maxWidth:600,margin:'0 auto'}}>

      {/* Header */}
      <div style={{textAlign:'center',marginBottom:48}}>
        <div className="cinzel fi1" style={{fontSize:11,color:C.mid,marginBottom:12,letterSpacing:'.25em'}}>{t.register.chapter}</div>
        <div className={`fi2 ${isAr?'ar-d':'script'}`} style={{fontSize:isAr?44:76,color:C.dark,lineHeight:isAr?1.2:.9,marginBottom:12}}>{t.register.title}</div>
        <div className="fi2" style={{fontSize:isAr?16:16,color:C.muted,fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif',fontStyle:isAr?'normal':'italic',lineHeight:1.6}}>
          {t.register.subtitle}
        </div>
        <div className="gold-s fi3" style={{marginTop:20}}></div>
      </div>

      {isPast&&(
        <div style={{padding:'16px 20px',background:'#fff9ec',border:`1px solid ${C.gold}`,borderRadius:4,marginBottom:36,display:'flex',gap:12,alignItems:'center'}}>
          <AlertCircle size={18} color={C.gold}/>
          <div style={{fontSize:16,color:C.gold,fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif',fontStyle:isAr?'normal':'italic'}}>{t.register.past}</div>
        </div>
      )}

      {/* ── Form card ── */}
      <div className="fi3" style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:6,padding:'40px 44px',display:'flex',flexDirection:'column',gap:32,boxShadow:'0 2px 16px rgba(45,74,45,.07)'}}>

        {/* First Name */}
        <div className="field-wrap">
          <label className={isAr?'field-label-ar':'field-label'}>
            {isAr?'':'01 · '}{t.register.firstName}
          </label>
          <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)}
            className={`input-box${isAr?' ar-b':''}`}
            placeholder={isAr?'محمد':'e.g. Mohammad'} disabled={isPast}/>
          {errors.firstName&&<div className="field-error">{errors.firstName}</div>}
        </div>

        {/* Family Name */}
        <div className="field-wrap">
          <label className={isAr?'field-label-ar':'field-label'}>
            {isAr?'':'02 · '}{t.register.familyName}
          </label>
          <input type="text" value={familyName} onChange={e=>setFamilyName(e.target.value)}
            className={`input-box${isAr?' ar-b':''}`}
            placeholder={isAr?'أبو شامية':'e.g. Abu Shamieh'} disabled={isPast}/>
          {errors.familyName&&<div className="field-error">{errors.familyName}</div>}
        </div>

        {/* Mobile */}
        <div className="field-wrap">
          <label className={isAr?'field-label-ar':'field-label'}>
            {isAr?'':'03 · '}{t.register.mobile}
          </label>
          <div style={{display:'flex',gap:10,alignItems:'stretch'}} dir="ltr">
            <select value={countryCode} onChange={e=>setCountryCode(e.target.value)}
              className="input-box" style={{width:150,flexShrink:0,fontSize:17,padding:'16px 36px 16px 16px'}} disabled={isPast}>
              {ALLOWED_COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
            </select>
            <input type="tel" value={mobile} onChange={e=>setMobile(e.target.value)}
              className="input-box" placeholder="79 123 4567" disabled={isPast} style={{flex:1}}/>
          </div>
          <div className={isAr?'field-hint-ar':'field-hint'}>{t.register.mobileHint}</div>
          {errors.mobile&&<div className="field-error">{errors.mobile}</div>}
        </div>

        {/* Affiliation */}
        <div className="field-wrap">
          <label className={isAr?'field-label-ar':'field-label'}>
            {isAr?'':'04 · '}{t.register.guestOf}
          </label>
          <select value={group} onChange={e=>setGroup(e.target.value)}
            className={`input-box${isAr?' ar-b':''}`} disabled={isPast}>
            <option value="Family of the Groom · Al-Nawfal">{t.register.groupGroom}</option>
            <option value="Family of the Bride · Al-Thabta">{t.register.groupBride}</option>
            <option value="Friends">{t.register.groupFriends}</option>
            <option value="Colleagues">{t.register.groupColleagues}</option>
          </select>
        </div>

        {/* Submit */}
        <div style={{paddingTop:8,textAlign:'center'}}>
          <button onClick={handleSubmit} className="btn-p" disabled={isPast} style={{width:'100%',fontSize:14,padding:'20px'}}>
            {isAr?<span className="btn-p-ar">{t.register.submit}</span>:t.register.submit}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── LOGIN ──────────────────────────── */
function LoginGate({ t, lang, onSuccess }) {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState(false);
  const isAr=lang==='ar';
  const handle=()=>{if(username.trim()==='admin'&&password==='wedding2026'){setError(false);onSuccess();}else setError(true);};
  return (
    <div className="fi" style={{maxWidth:440,margin:'60px auto',textAlign:'center'}}>
      <div className="cinzel fi1" style={{fontSize:11,color:C.mid,marginBottom:12,letterSpacing:'.22em'}}>
        {isAr?<span className="ar-b" style={{letterSpacing:0,fontSize:14}}>{t.login.chapter}</span>:t.login.chapter}
      </div>
      <div className={`fi2 ${isAr?'ar-d':'serif'}`} style={{fontSize:isAr?38:42,color:C.dark,lineHeight:1.1,marginBottom:10}}>{t.login.title}</div>
      <div className="fi2" style={{fontSize:isAr?15:15,color:C.muted,fontFamily:isAr?'Reem Kufi,serif':'Cormorant Garamond,serif',fontStyle:isAr?'normal':'italic',marginBottom:32}}>{t.login.subtitle}</div>
      <div className="gold-s fi3" style={{marginBottom:36}}></div>

      <div className="fi3" style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:6,padding:'36px 40px',textAlign:'left',boxShadow:'0 2px 16px rgba(45,74,45,.07)',display:'flex',flexDirection:'column',gap:24}}>
        {[['username',t.login.username,'text',username,setUsername],['password',t.login.password,'password',password,setPassword]].map(([key,label,type,val,setter])=>(
          <div className="field-wrap" key={key}>
            <label className={isAr?'field-label-ar':'field-label'}>
              {isAr?'':key==='username'?'01 · ':'02 · '}{isAr?<span className="ar-b">{label}</span>:label}
            </label>
            <input type={type} value={val}
              onChange={e=>{setter(e.target.value);setError(false);}}
              onKeyDown={e=>e.key==='Enter'&&handle()}
              className={`input-box${isAr?' ar-b':''}`} autoFocus={key==='username'}/>
          </div>
        ))}
        {error&&<div style={{padding:'12px 16px',background:'#fff5f5',border:'1px solid #fcc',borderRadius:4,display:'flex',gap:10,alignItems:'center'}}>
          <AlertCircle size={16} color="#b91c1c"/>
          <div style={{fontSize:15,color:'#b91c1c',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.login.error}</div>
        </div>}
        <button onClick={handle} className="btn-p" style={{width:'100%',fontSize:13}}>
          {isAr?<span className="btn-p-ar">{t.login.submit}</span>:t.login.submit}
        </button>
      </div>
      <div style={{fontSize:13,color:C.muted,marginTop:18,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.login.hint}</div>
    </div>
  );
}

/* ──────────────────────────── ADMIN ──────────────────────────── */
function AdminView({ t, lang, guests, updateGuest }) {
  const [auth,setAuth]=useState(false);
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('all');
  const [selGuest,setSelGuest]=useState(null);
  const [viewQR,setViewQR]=useState(null);
  const isAr=lang==='ar';
  if(!auth) return <LoginGate t={t} lang={lang} onSuccess={()=>setAuth(true)}/>;

  const filtered=guests.filter(g=>{
    const m=`${g.firstName} ${g.familyName} ${g.fullPhone}`.toLowerCase().includes(search.toLowerCase());
    if(filter==='assigned') return m&&g.tableNumber!==null;
    if(filter==='unassigned') return m&&g.tableNumber===null;
    if(filter==='attended') return m&&g.checkedInAt!==null;
    return m;
  });
  const stats={total:guests.length,assigned:guests.filter(g=>g.tableNumber!==null).length,attended:guests.filter(g=>g.checkedInAt!==null).length,unassigned:guests.filter(g=>g.tableNumber===null).length};
  const assignSeat=(id,tn,sn)=>{updateGuest(id,{tableNumber:tn,seatNumber:sn});setSelGuest(null);};
  const getOcc=tn=>guests.filter(g=>g.tableNumber===tn).map(g=>g.seatNumber);

  return (
    <div className="fi">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12,marginBottom:40}}>
        <div>
          <div className="cinzel fi1" style={{fontSize:11,color:C.mid,marginBottom:10,letterSpacing:'.2em'}}>{t.admin.chapter}</div>
          <div className={`fi2 ${isAr?'ar-d':'serif'}`} style={{fontSize:isAr?40:50,color:C.dark,lineHeight:1}}>{t.admin.title}</div>
        </div>
        <button onClick={()=>setAuth(false)} className="btn-s" style={{fontSize:11,padding:'10px 20px'}}>{t.login.signOut}</button>
      </div>

      {/* Stats */}
      <div className="fi2" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:1,marginBottom:40,background:C.border,borderRadius:4,overflow:'hidden'}}>
        {[[t.admin.total,stats.total,Users],[t.admin.assigned,stats.assigned,LayoutGrid],[t.admin.unassigned,stats.unassigned,TrendingUp],[t.admin.attended,stats.attended,CheckCircle2]].map(([label,val,Icon],i)=>(
          <div key={i} style={{padding:'24px',background:'#fff'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div style={{fontSize:isAr?14:11,color:C.mid,fontFamily:isAr?'Reem Kufi,serif':'Cinzel,serif',letterSpacing:isAr?0:'.15em'}}>{label}</div>
              <Icon size={16} color={C.gold} strokeWidth={1.5}/>
            </div>
            <div className="serif" style={{fontSize:52,color:C.dark,lineHeight:1}}>{String(val).padStart(2,'0')}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="fi3" style={{display:'flex',gap:16,marginBottom:24,flexWrap:'wrap',alignItems:'center',paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
        <div style={{position:'relative',flex:'1 1 260px'}}>
          <Search size={15} style={{position:'absolute',[isAr?'right':'left']:16,top:'50%',transform:'translateY(-50%)',color:C.mid}}/>
          <input type="text" placeholder={t.admin.search} value={search} onChange={e=>setSearch(e.target.value)}
            className={`input-box${isAr?' ar-b':''}`}
            style={{[isAr?'paddingRight':'paddingLeft']:46,fontSize:17}}/>
        </div>
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
          {['all','unassigned','assigned','attended'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{background:filter===f?C.dark:'transparent',color:filter===f?'#fff':C.muted,border:`1px solid ${filter===f?C.dark:C.border}`,padding:'8px 16px',cursor:'pointer',borderRadius:3,fontSize:isAr?13:11,fontFamily:isAr?'Reem Kufi,serif':'Cinzel,serif',letterSpacing:isAr?0:'.1em',transition:'all .25s'}}>
              {t.admin.filters[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="fi4">
        {filtered.length===0
          ? <div style={{padding:60,textAlign:'center',color:C.muted,fontSize:18,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.admin.noMatch}</div>
          : <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:`2px solid ${C.border}`}}>
                  {t.admin.cols.map((h,i)=>(
                    <th key={i} style={{padding:'12px 14px',textAlign:isAr?'right':'left',fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:'.15em',color:C.mid,fontWeight:500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(g=>(
                  <tr key={g.id} style={{borderBottom:`1px solid #eee8d8`}}>
                    <td style={{padding:'16px 14px'}}>
                      <div className="serif" style={{fontSize:20,color:C.dark}}>{g.firstName} {g.familyName}</div>
                    </td>
                    <td style={{padding:'16px 14px'}} dir="ltr">
                      <div style={{fontSize:14,color:C.muted,fontFamily:'monospace'}}>{g.fullPhone}</div>
                    </td>
                    <td style={{padding:'16px 14px'}}>
                      <div style={{fontSize:14,color:C.muted,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{g.group}</div>
                    </td>
                    <td style={{padding:'16px 14px'}}>
                      {g.tableNumber
                        ? <div className="cinzel" style={{fontSize:12,color:C.dark}}>T{String(g.tableNumber).padStart(2,'0')} · S{String(g.seatNumber).padStart(2,'0')}</div>
                        : <div style={{fontSize:14,color:'#bbb',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.admin.notAssigned}</div>}
                    </td>
                    <td style={{padding:'16px 14px'}}>
                      {g.checkedInAt
                        ? <span style={{display:'inline-flex',alignItems:'center',gap:6,background:'#f0f7ec',padding:'4px 10px',borderRadius:12,fontSize:12,color:C.light,fontFamily:'Cinzel,serif',letterSpacing:'.1em'}}><CheckCircle2 size={12}/>{t.admin.attendedLabel}</span>
                        : <span style={{fontSize:14,color:C.muted,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.admin.registeredLabel}</span>}
                    </td>
                    <td style={{padding:'16px 14px',textAlign:isAr?'left':'right'}}>
                      <div style={{display:'inline-flex',gap:12}}>
                        <button onClick={()=>setSelGuest(g)} className="act-link">{t.admin.seat}</button>
                        <button onClick={()=>setViewQR(g)} className="act-link">{t.admin.qr}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </div>

      {/* Seat modal */}
      {selGuest&&(
        <div onClick={()=>setSelGuest(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:16}}>
          <div onClick={e=>e.stopPropagation()} className="fi" style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:6,padding:'40px 32px',maxWidth:720,width:'100%',maxHeight:'90vh',overflow:'auto',boxShadow:'0 8px 40px rgba(0,0,0,.2)'}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div className="cinzel" style={{fontSize:11,color:C.mid,marginBottom:8,letterSpacing:'.2em'}}>SEAT ASSIGNMENT</div>
              <div className="serif" style={{fontSize:32,color:C.dark,marginBottom:6}}>{selGuest.firstName} {selGuest.familyName}</div>
              <div style={{fontSize:15,color:C.muted,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',marginBottom:16}}>{t.admin.selectSeat}</div>
              <div className="gold-s"></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12,marginBottom:28}}>
              {Array.from({length:TOTAL_TABLES}).map((_,tIdx)=>{
                const tn=tIdx+1;const occ=getOcc(tn);
                return (
                  <div key={tn} style={{border:`1px solid ${C.border}`,borderRadius:4,padding:'12px',background:'#fafaf7'}}>
                    <div className="cinzel" style={{fontSize:10,color:C.mid,marginBottom:8,textAlign:'center',letterSpacing:'.15em'}}>TABLE {String(tn).padStart(2,'0')}</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:3}}>
                      {Array.from({length:SEATS_PER_TABLE}).map((_,sIdx)=>{
                        const sn=sIdx+1;
                        const isOcc=occ.includes(sn)&&!(selGuest.tableNumber===tn&&selGuest.seatNumber===sn);
                        const isMine=selGuest.tableNumber===tn&&selGuest.seatNumber===sn;
                        return <button key={sn} disabled={isOcc} onClick={()=>assignSeat(selGuest.id,tn,sn)}
                          style={{padding:5,fontSize:10,background:isMine?C.dark:isOcc?'#f0ece0':'#fff',color:isMine?'#fff':isOcc?'#ccc':C.dark,border:`1px solid ${isMine?C.dark:C.border}`,cursor:isOcc?'not-allowed':'pointer',borderRadius:2,fontFamily:'Cinzel,serif',transition:'all .2s'}}>
                          {String(sn).padStart(2,'0')}
                        </button>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{textAlign:'center'}}><button onClick={()=>setSelGuest(null)} className="btn-s">{t.admin.close}</button></div>
          </div>
        </div>
      )}

      {/* QR modal */}
      {viewQR&&(
        <div onClick={()=>setViewQR(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:16}}>
          <div onClick={e=>e.stopPropagation()} className="fi" style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:6,padding:'40px',maxWidth:400,textAlign:'center',boxShadow:'0 8px 40px rgba(0,0,0,.2)'}}>
            <div className="cinzel" style={{fontSize:11,color:C.mid,marginBottom:10,letterSpacing:'.2em'}}>ENTRY PASS</div>
            <div className="serif" style={{fontSize:28,color:C.dark,marginBottom:6}}>{viewQR.firstName} {viewQR.familyName}</div>
            <div className="gold-s" style={{marginBottom:24}}></div>
            <div style={{border:`1px solid ${C.border}`,display:'inline-block',padding:16,background:'#fff',marginBottom:16,borderRadius:4}}>
              <RealQRCode value={viewQR.id} size={200}/>
            </div>
            <div style={{fontSize:12,color:C.muted,fontFamily:'monospace',marginBottom:24}}>REF · {viewQR.id}</div>
            <button onClick={()=>setViewQR(null)} className="btn-s" style={{width:'100%'}}>{t.admin.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── SCANNER ──────────────────────────── */
function ScannerView({ t, lang, guests, updateGuest }) {
  const [scannedGuest,setScannedGuest]=useState(null);
  const [scanHistory,setScanHistory]=useState([]);
  const [manualId,setManualId]=useState('');
  const [isScanning,setIsScanning]=useState(false);
  const [cameraError,setCameraError]=useState(null);
  const qrRef=useRef(null);
  const guestsRef=useRef(guests);
  const isAr=lang==='ar';
  useEffect(()=>{guestsRef.current=guests;},[guests]);

  const processScan=txt=>{
    let gid=txt.trim();
    if(gid.includes('/')) gid=gid.split('/').pop().split('?')[0].split('#')[0];
    const g=guestsRef.current.find(x=>x.id===gid);
    if(!g){setScannedGuest({error:`${t.scanner.notFound}: "${gid.substring(0,30)}"`});return;}
    const already=g.checkedInAt!==null;
    setScannedGuest({...g,alreadyChecked:already});
    if(!already){updateGuest(g.id,{checkedInAt:new Date().toISOString()});setScanHistory(p=>[{name:`${g.firstName} ${g.familyName}`,time:new Date().toLocaleTimeString()},...p].slice(0,10));}
  };

  const startCamera=async()=>{
    setCameraError(null);setScannedGuest(null);
    try {
      if(!window.Html5Qrcode){
        await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js';s.onload=res;s.onerror=()=>rej(new Error('fail'));document.head.appendChild(s);});
      }
      setIsScanning(true);
      await new Promise(r=>setTimeout(r,150));
      const elem=document.getElementById('qr-reader');
      if(!elem){setIsScanning(false);setCameraError('Scanner not ready.');return;}
      const scanner=new window.Html5Qrcode('qr-reader');
      qrRef.current=scanner;
      await scanner.start({facingMode:'environment'},{fps:10,qrbox:{width:220,height:220}},(decoded)=>{processScan(decoded);stopCamera();},()=>{});
    } catch(err){
      setIsScanning(false);
      const msg=err?.message||String(err);
      if(msg.toLowerCase().includes('permission')||msg.toLowerCase().includes('notallowed')) setCameraError(t.scanner.permissionDenied);
      else if(msg.toLowerCase().includes('notfound')) setCameraError(t.scanner.noCamera);
      else setCameraError(`${t.scanner.cantStart}: ${msg}`);
    }
  };
  const stopCamera=async()=>{
    if(qrRef.current){try{await qrRef.current.stop();qrRef.current.clear();}catch(e){}qrRef.current=null;}
    setIsScanning(false);
  };
  useEffect(()=>()=>{stopCamera();},[]);

  return (
    <div className="fi">
      <div style={{textAlign:'center',marginBottom:48}}>
        <div className="cinzel fi1" style={{fontSize:11,color:C.mid,marginBottom:10,letterSpacing:'.22em'}}>{t.scanner.chapter}</div>
        <div className={`fi2 ${isAr?'ar-d':'serif'}`} style={{fontSize:isAr?44:50,color:C.dark,lineHeight:1,marginBottom:16}}>{t.scanner.title}</div>
        <div className="gold-s fi3"></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:28}}>
        {/* Left */}
        <div className="fi3 card" style={{borderColor:C.border,borderRadius:6}}>
          <div style={{fontSize:isAr?14:11,color:C.mid,marginBottom:18,fontFamily:isAr?'Reem Kufi,serif':'Cinzel,serif',letterSpacing:isAr?0:'.18em'}}>{t.scanner.cameraLabel}</div>
          {!isScanning
            ? <div style={{background:C.dark,padding:40,textAlign:'center',marginBottom:20,minHeight:260,display:'flex',flexDirection:'column',justifyContent:'center',borderRadius:4}}>
                <Camera size={40} color={C.gold} strokeWidth={1} style={{margin:'0 auto 14px'}}/>
                <div className="cinzel" style={{color:C.gold,fontSize:11,marginBottom:18,letterSpacing:'.18em'}}>{t.scanner.cameraOff}</div>
                <button onClick={startCamera} className="btn-p" style={{background:C.gold,color:C.dark,margin:'0 auto',padding:'14px 28px',fontSize:13}}>
                  {isAr?<span className="btn-p-ar">{t.scanner.startCamera}</span>:t.scanner.startCamera}
                </button>
                <div style={{color:'#888',fontSize:13,marginTop:14,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.scanner.allowHint}</div>
              </div>
            : <div style={{marginBottom:20}}>
                <div id="qr-reader" style={{width:'100%',minHeight:260,background:'#000',overflow:'hidden',borderRadius:4}}></div>
                <button onClick={stopCamera} className="btn-s" style={{width:'100%',marginTop:12}}>{t.scanner.stopCamera}</button>
              </div>}
          {cameraError&&<div style={{padding:'12px 16px',background:'#fff5f5',border:'1px solid #fcc',borderRadius:4,marginBottom:16}}>
            <div style={{fontSize:15,color:'#b91c1c',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{cameraError}</div>
          </div>}

          <div style={{marginTop:28,paddingTop:28,borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:isAr?14:11,color:C.mid,marginBottom:14,fontFamily:isAr?'Reem Kufi,serif':'Cinzel,serif',letterSpacing:isAr?0:'.18em'}}>{t.scanner.manualLabel}</div>
            <input type="text" value={manualId} onChange={e=>setManualId(e.target.value)}
              placeholder={t.scanner.manualPlaceholder}
              className={`input-box${isAr?' ar-b':''}`} style={{marginBottom:14,fontSize:17}}/>
            <button onClick={()=>{if(manualId.trim()){processScan(manualId);setManualId('');}}} className="btn-s" style={{width:'100%',fontSize:12}}>
              {isAr?<span className="btn-p-ar" style={{color:'inherit'}}>{t.scanner.checkByID}</span>:t.scanner.checkByID}
            </button>
          </div>

          <div style={{marginTop:28,paddingTop:28,borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:isAr?14:11,color:C.mid,marginBottom:14,fontFamily:isAr?'Reem Kufi,serif':'Cinzel,serif',letterSpacing:isAr?0:'.18em'}}>{t.scanner.quickTest}</div>
            <div style={{display:'flex',flexDirection:'column',gap:1,background:C.border,borderRadius:4,overflow:'hidden'}}>
              {guests.slice(0,5).map(g=>(
                <button key={g.id} onClick={()=>processScan(g.id)}
                  style={{textAlign:isAr?'right':'left',background:'#fafaf7',border:'none',padding:'14px 16px',cursor:'pointer',fontFamily:'Cormorant Garamond,serif',fontSize:18,color:C.dark,transition:'background .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='#f0f7ec'}
                  onMouseLeave={e=>e.currentTarget.style.background='#fafaf7'}>
                  {g.firstName} {g.familyName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="fi4">
          {scannedGuest
            ? <div className="fi card" style={{borderRadius:6,borderColor:scannedGuest.error?'#fcc':scannedGuest.alreadyChecked?C.gold:C.light,borderWidth:2}}>
                {scannedGuest.error
                  ? <div style={{textAlign:'center',padding:20}}>
                      <XCircle size={48} color="#b91c1c" strokeWidth={1} style={{margin:'0 auto 12px'}}/>
                      <div className="serif" style={{fontSize:20,color:'#b91c1c'}}>{scannedGuest.error}</div>
                    </div>
                  : <>
                      <div style={{textAlign:'center',marginBottom:24}}>
                        {scannedGuest.alreadyChecked
                          ? <><AlertCircle size={44} color={C.gold} strokeWidth={1} style={{margin:'0 auto 10px'}}/><div className="cinzel" style={{fontSize:12,color:C.gold,letterSpacing:'.25em'}}>{t.scanner.alreadyIn}</div></>
                          : <><CheckCircle2 size={44} color={C.light} strokeWidth={1} style={{margin:'0 auto 10px'}}/><div className="cinzel" style={{fontSize:12,color:C.light,letterSpacing:'.3em'}}>{t.scanner.welcome}</div></>}
                      </div>
                      <div className="script" style={{fontSize:64,color:C.dark,textAlign:'center',lineHeight:.9,marginBottom:6}}>{scannedGuest.firstName}</div>
                      <div className="ital" style={{fontSize:22,color:C.muted,textAlign:'center',marginBottom:28}}>{scannedGuest.familyName}</div>
                      <div className="gold-s" style={{marginBottom:24}}></div>
                      {[[t.scanner.phone,scannedGuest.fullPhone],[t.scanner.group,scannedGuest.group]].map(([k,v])=>(
                        <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'14px 0',borderBottom:`1px solid ${C.border}`}}>
                          <div style={{fontSize:12,color:C.mid,fontFamily:'Cinzel,serif',letterSpacing:'.12em'}}>{k}</div>
                          <div style={{fontSize:16,color:C.dark,fontFamily:'Cormorant Garamond,serif'}}>{v}</div>
                        </div>
                      ))}
                      {scannedGuest.tableNumber
                        ? <div style={{background:C.dark,padding:28,textAlign:'center',marginTop:20,borderRadius:4}}>
                            <div className="cinzel" style={{fontSize:10,color:C.gold,marginBottom:16,letterSpacing:'.25em'}}>{t.scanner.proceed}</div>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                              {[[t.scanner.table,scannedGuest.tableNumber],[t.scanner.seat,scannedGuest.seatNumber]].map(([l,v])=>(
                                <div key={l}>
                                  <div className="cinzel" style={{fontSize:9,color:'#888',marginBottom:4,letterSpacing:'.15em'}}>{l.toUpperCase()}</div>
                                  <div className="serif" style={{fontSize:52,color:'#fff',lineHeight:1}}>{String(v).padStart(2,'0')}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        : <div style={{background:'#fafaf7',padding:18,textAlign:'center',marginTop:20,border:`1px solid ${C.border}`,borderRadius:4}}>
                            <div style={{fontSize:16,color:C.muted,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.scanner.noSeat}</div>
                          </div>}
                    </>}
              </div>
            : <div className="card" style={{textAlign:'center',padding:64,minHeight:340,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',borderColor:C.border,borderRadius:6}}>
                <Scan size={36} color={C.gold} strokeWidth={1} style={{marginBottom:16}}/>
                <div style={{fontSize:18,color:C.muted,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{t.scanner.awaiting}</div>
              </div>}

          {scanHistory.length>0&&(
            <div className="card" style={{marginTop:20,borderColor:C.border,borderRadius:6}}>
              <div className="cinzel" style={{fontSize:11,color:C.mid,marginBottom:16,letterSpacing:'.18em'}}>{t.scanner.recent}</div>
              {scanHistory.map((e,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:i<scanHistory.length-1?`1px solid #eee8d8`:'none'}}>
                  <div className="serif" style={{fontSize:18,color:C.dark}}>{e.name}</div>
                  <div className="cinzel" style={{fontSize:11,color:C.muted}}>{e.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
