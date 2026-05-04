import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Search,
  AlertCircle,
  Camera,
  Globe,
  Users,
  TrendingUp,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const floralUrl = `${import.meta.env.BASE_URL}floral.jpeg`;
const headerUrl = `${import.meta.env.BASE_URL}header.webp`;

const TRANSLATIONS: any = {
  en: {
    dir: "ltr",
    nav: {
      card: "Invitation",
      register: "RSVP",
      admin: "Admin",
      scanner: "Entry",
    },
    landing: {
      bismillah: "In the Name of Allah, the Most Gracious, the Most Merciful",
      verse: "And He placed between you Mawaddah and Rahmah (Qur'an 30:21)",
      together: "TOGETHER WITH THEIR FAMILIES",
      groomFamily: "The Family of Mr.",
      groomName: "Jehad Abu-Shamiyeh",
      groomHouse: "Al Nofal",
      brideFamily: "The Family of Mr.",
      brideName: "Osama Zeidan",
      brideHouse: "Al Thabatah",
      invite: "Joyfully invite you to celebrate the marriage of",
      groom: "Majd",
      bride: "Dana",
      willing: "By the will of Allah Almighty",
      time: "7:15 PM",
      venue: "The Ritz Carlton Amman",
      city: "AMMAN · JORDAN",
      childrenNotice:
        "Per hotel policy, the presence of children is respectfully declined",
      rsvpTitle: "KINDLY RESPOND",
      rsvpDeadline: "BY THE 1ST OF JUNE",
      cta: "Confirm Attendance",
    },
    register: {
      chapter: "RSVP",
      title: "Confirm Your Presence",
      subtitle: "We humbly request the favor of your response",
      firstName: "First Name",
      familyName: "Family Name",
      mobile: "Mobile Number",
      mobileHint: "For WhatsApp delivery of your entry pass",
      guestOf: "I am a guest of",
      groupGroom: "Family of the Groom (Al Nofal)",
      groupBride: "Family of the Bride (Al Thabatah)",
      groupFriends: "Dear Friends",
      groupColleagues: "Esteemed Colleagues",
      submit: "Confirm My Attendance",
      required: "This field is required",
      invalid: "Please enter a valid phone number",
      duplicate: "This number is already registered",
      past: "The RSVP period has now closed.",
      thankYou: "Thank you,",
      sentVia: "Your entry pass has been reserved. Show this QR code at the entrance.",
      yourQR: "YOUR ENTRY PASS",
      yourName: "Presented for",
      testNote:
        "Please present this pass at the entrance of The Ritz-Carlton on the evening of the celebration.",
      companions: "Additional Guests",
      companionsHint: "How many guests are joining you? (max 4)",
      companionName: "Companion's Full Name",
      companionPhone: "Companion's Phone Number",
      reservedSeats: (n: number) => n === 1 ? "We have reserved a seat in your honor." : `We have reserved ${n} seats in your honour.`,
    },
    login: {
      chapter: "ADMIN ACCESS",
      title: "Administrator Login",
      subtitle: "Authorized personnel only",
      username: "Username",
      password: "Password",
      submit: "Sign In",
      error: "Incorrect credentials. Please try again.",
      hint: "",
      signOut: "Sign Out",
    },
    admin: {
      chapter: "REGISTRY",
      title: "Guest Management",
      total: "Registered",
      assigned: "Seated",
      unassigned: "Pending",
      attended: "Attended",
      search: "Search by name or number…",
      filters: {
        all: "All Guests",
        unassigned: "Pending",
        assigned: "Seated",
        attended: "Attended",
      },
      attendedLabel: "PRESENT",
      registeredLabel: "Registered",
      noMatch: "No guests found.",
      notAssigned: "Not assigned",
      cols: ["Guest", "Phone", "Party", "Placement", "Status", "WhatsApp", ""],
      seat: "Assign Seat",
      qr: "View Pass",
      resend: "Send Pass",
      resendSent: "Sent ✓",
      selectSeat: "Select a table and seat below",
      close: "Close",
    },
    invite: {
      chapter: "INVITATIONS",
      title: "Send WhatsApp Invitations",
      subtitle: "Enter one phone number per line (international format, e.g. +962791234567)",
      placeholder: "+962791234567\n+966501234567\n+971501234567",
      lang: "Message Language",
      send: "Send Invitations",
      sending: "Sending…",
      results: "Results",
      sent: "Sent",
      failed: "Failed",
      noPhones: "Please enter at least one phone number.",
      toggle: "Send WhatsApp Invitations",
    },
    scanner: {
      chapter: "ENTRY",
      title: "Guest Reception",
      cameraLabel: "QR SCANNER",
      cameraOff: "Camera is off",
      startCamera: "Start Camera",
      stopCamera: "Stop Camera",
      allowHint: "Camera permission is required",
      manualLabel: "Manual Lookup",
      manualPlaceholder: "Paste or type the guest reference code…",
      checkByID: "Check In Guest",
      quickTest: "Check In Guest By Name",
      welcome: "WELCOME",
      alreadyIn: "ALREADY CHECKED IN",
      phone: "Phone",
      group: "Party",
      proceed: "PLEASE PROCEED TO",
      table: "Table",
      seat: "Seat",
      noSeat: "Please see the host for seating",
      notFound: "Guest not found",
    },
  },
  ar: {
    dir: "rtl",
    nav: {
      card: "الدعوة",
      register: "التأكيد",
      admin: "السجل",
      scanner: "الاستقبال",
    },
    landing: {
      bismillah: "بسم الله الرحمن الرحيم",
      verse: "وجعل بينكم مودة ورحمة",
      together: "بحضور عائلتيهم",
      groomFamily: "عائلة السيد",
      groomName: "جهاد جميل أبو شامية",
      groomHouse: "آل نوفل",
      brideFamily: "عائلة السيد",
      brideName: "أسامة محمد زيدان",
      brideHouse: "آل الثبتة",
      invite: "يتشرفون بدعوتكم لحضور حفل زفاف",
      groom: "مجد",
      bride: "دانا",
      willing: "وذلك بمشيئة الله تعالى",
      time: "السابعة والربع مساءً",
      venue: "فندق ريتز كارلتون",
      city: "عمّان · الأردن",
      childrenNotice: "حسب سياسة الفندق يمنع اصطحاب الأطفال",
      rsvpTitle: "الرجاء تأكيد الحضور",
      rsvpDeadline: "قبل الأول من حزيران",
      cta: "تأكيد الحضور",
    },
    register: {
      chapter: "تأكيد الحضور",
      title: "تأكيد الحضور",
      subtitle: "نتشرف بتلقي تأكيدكم الكريم",
      firstName: "الاسم الأول",
      familyName: "اسم العائلة",
      mobile: "رقم الجوال",
      mobileHint: "لإرسال بطاقة الدخول عبر الواتساب",
      guestOf: "أنا ضيف",
      groupGroom: "عائلة العريس (آل نوفل · Al Nofal)",
      groupBride: "عائلة العروس (آل الثبتة · Al Thabatah)",
      groupFriends: "الأصدقاء الأعزاء",
      groupColleagues: "الزملاء الكرام",
      submit: "تأكيد حضوري",
      required: "هذا الحقل مطلوب",
      invalid: "الرجاء إدخال رقم هاتف صحيح",
      duplicate: "هذا الرقم مسجّل مسبقاً",
      past: "انتهت فترة تأكيد الحضور.",
      thankYou: "مع جزيل الشكر،",
      sentVia: "لقد حُجز مقعدكم. الرجاء إبراز رمز QR هذا عند المدخل.",
      yourQR: "بطاقة الدخول",
      yourName: "مُقدّمة إلى",
      testNote:
        "الرجاء تقديم هذه البطاقة عند مدخل فندق ريتز كارلتون مساء الحفل.",
      companions: "مرافقون",
      companionsHint: "كم عدد المرافقين لك؟ (بحد أقصى 4)",
      companionName: "الاسم الكامل للمرافق",
      companionPhone: "رقم هاتف المرافق",
      reservedSeats: (n: number) => n === 1 ? "لقد حجزنا لكم مقعداً خُصّص بمحبة." : `لقد حجزنا لكم ${n} مقاعد خُصّصت بمحبة.`,
    },
    login: {
      chapter: "دخول المسؤول",
      title: "دخول المسؤول",
      subtitle: "للمخوّلين فقط",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      error: "بيانات غير صحيحة. حاول مرة أخرى.",
      hint: "",
      signOut: "تسجيل الخروج",
    },
    admin: {
      chapter: "السجل",
      title: "إدارة الضيوف",
      total: "المسجّلون",
      assigned: "المقاعد",
      unassigned: "معلّق",
      attended: "الحاضرون",
      search: "ابحث بالاسم أو الرقم…",
      filters: {
        all: "الكل",
        unassigned: "معلّق",
        assigned: "بمقعد",
        attended: "حاضر",
      },
      attendedLabel: "حاضر",
      registeredLabel: "مسجّل",
      noMatch: "لا توجد نتائج.",
      notAssigned: "غير معيّن",
      cols: ["الضيف", "الرقم", "الجهة", "الموقع", "الحالة", "واتساب", ""],
      seat: "تعيين مقعد",
      qr: "عرض البطاقة",
      resend: "إرسال البطاقة",
      resendSent: "تم الإرسال ✓",
      selectSeat: "اختر الطاولة والمقعد",
      close: "إغلاق",
    },
    invite: {
      chapter: "الدعوات",
      title: "إرسال دعوات واتساب",
      subtitle: "أدخل رقم هاتف واحد في كل سطر (بالصيغة الدولية، مثال: ‎+962791234567)",
      placeholder: "+962791234567\n+966501234567",
      lang: "لغة الرسالة",
      send: "إرسال الدعوات",
      sending: "جارٍ الإرسال…",
      results: "النتائج",
      sent: "تم الإرسال",
      failed: "فشل الإرسال",
      noPhones: "الرجاء إدخال رقم هاتف واحد على الأقل.",
      toggle: "إرسال دعوات واتساب",
    },
    scanner: {
      chapter: "الاستقبال",
      title: "استقبال الضيوف",
      cameraLabel: "ماسح QR",
      cameraOff: "الكاميرا متوقفة",
      startCamera: "تشغيل الكاميرا",
      stopCamera: "إيقاف الكاميرا",
      allowHint: "يتطلب إذن الكاميرا",
      manualLabel: "بحث يدوي",
      manualPlaceholder: "أدخل الرمز المرجعي للضيف…",
      checkByID: "تسجيل وصول الضيف",
      quickTest: "تسجيل الحضور بالاسم",
      welcome: "أهلاً وسهلاً",
      alreadyIn: "تم تسجيل الدخول مسبقاً",
      phone: "الرقم",
      group: "الجهة",
      proceed: "الرجاء التوجه إلى",
      table: "طاولة",
      seat: "مقعد",
      noSeat: "الرجاء مراجعة المضيف",
      notFound: "الضيف غير موجود",
    },
  },
};

const ALLOWED_COUNTRIES = [
  { code: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+967", name: "Yemen", flag: "🇾🇪" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+970", name: "Palestine", flag: "🇵🇸" },
  { code: "+963", name: "Syria", flag: "🇸🇾" },
  { code: "+964", name: "Iraq", flag: "🇮🇶" },
  { code: "+218", name: "Libya", flag: "🇱🇾" },
  { code: "+216", name: "Tunisia", flag: "🇹🇳" },
  { code: "+213", name: "Algeria", flag: "🇩🇿" },
  { code: "+212", name: "Morocco", flag: "🇲🇦" },
  { code: "+249", name: "Sudan", flag: "🇸🇩" },
  { code: "+1", name: "USA / Canada", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+357", name: "Cyprus", flag: "🇨🇾" },
  { code: "+98", name: "Iran", flag: "🇮🇷" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
];

const RSVP_DEADLINE = new Date("2026-06-01T23:59:59");
const TOTAL_TABLES = 20;
const SEATS_PER_TABLE = 10;
const generateId = () =>
  "xxxxxxxxxxxx".replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16),
  );
const validatePhone = (_cc: string, num: string) => {
  const c = num.replace(/\D/g, "");
  return c.length >= 7 && c.length <= 12;
};

const C = {
  bg: "#fafaf7",
  dark: "#2d4a2d",
  mid: "#4a6b3a",
  light: "#7a9a6a",
  gold: "#b8960c",
  goldLight: "#d4b44a",
  cream: "#f5f2e8",
  border: "#d8d4c0",
  muted: "#6a6a58",
  inputBg: "#ffffff",
};

const FloralHeader: React.FC<{ position?: "top" | "bottom" }> = ({
  position = "top",
}) => (
  <img
    src={headerUrl}
    alt=""
    style={{
      width: "100%",
      display: "block",
      pointerEvents: "none",
      transform: position === "bottom" ? "scaleY(-1)" : undefined,
    }}
  />
);

const RealQRCode: React.FC<{ value: string; size?: number }> = ({
  value,
  size = 200,
}) => {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    const gen = async () => {
      try {
        if (!(window as any).qrcode) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement("script");
            s.src =
              "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
            s.onload = () => res();
            s.onerror = () => rej(new Error("fail"));
            document.head.appendChild(s);
          });
        }
        const qr = (window as any).qrcode(0, "M");
        qr.addData(value);
        qr.make();
        const count = qr.getModuleCount();
        const cell = size / count;
        let rects = "";
        for (let r = 0; r < count; r++)
          for (let c = 0; c < count; c++)
            if (qr.isDark(r, c))
              rects += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="#2d4a2d"/>`;
        setSvg(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#fff"/>${rects}</svg>`,
        );
      } catch {
        setSvg(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#f5f5f0"/></svg>`,
        );
      }
    };
    gen();
  }, [value, size]);
  if (!svg)
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "#f5f5f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: 13,
        }}
      >
        …
      </div>
    );
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};

type Guest = {
  id: string;
  primaryGuestId: string | null;
  firstName: string;
  familyName: string;
  countryCode: string;
  mobile: string;
  fullPhone: string;
  seatNumber: number | null;
  tableNumber: number | null;
  group: string;
  registeredAt: string;
  checkedInAt: string | null;
  whatsappSent: boolean;
};

export default function WeddingRSVP() {
  const [view, setView] = useState<
    "landing" | "register" | "admin" | "scanner"
  >("landing");
  const [lang, setLang] = useState<"en" | "ar">("ar");
  const t = TRANSLATIONS[lang];
  const [authRole, setAuthRole] = useState<"none" | "admin" | "viewer">("none");
  const isAdminAuth = authRole === "admin";
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestsLoading, setGuestsLoading] = useState(true);

  const refreshGuests = async () => {
    try {
      const r = await fetch("/api/guests");
      const data = await r.json();
      if (data.ok) {
        setGuests(
          (data.guests as any[]).map((g) => ({
            id: g.id,
            primaryGuestId: g.primaryGuestId ?? null,
            firstName: g.firstName,
            familyName: g.familyName,
            countryCode: g.countryCode,
            mobile: g.mobile,
            fullPhone: g.fullPhone,
            seatNumber: g.seatNumber ?? null,
            tableNumber: g.tableNumber ?? null,
            group: g.group,
            registeredAt: g.registeredAt,
            checkedInAt: g.checkedInAt ?? null,
            whatsappSent: g.whatsappSent ?? false,
          })),
        );
      }
    } catch {
      /* network error — keep existing list */
    } finally {
      setGuestsLoading(false);
    }
  };

  useEffect(() => {
    refreshGuests();
  }, []);

  const addGuest = (_g: Guest) => {
    refreshGuests();
  };
  const updateGuest = (id: string, u: Partial<Guest>) =>
    setGuests((p) => p.map((g) => (g.id === id ? { ...g, ...u } : g)));
  const deleteGuest = async (id: string) => {
    setGuests((p) => p.filter((g) => g.id !== id));
    try {
      await fetch(`/api/guests/${id}`, { method: "DELETE" });
    } catch {
      await refreshGuests();
    }
  };
  const exportCSV = () => {
    const header = ["ID", "First Name", "Family Name", "Phone", "Party", "Table", "Seat", "Registered At", "Checked In At", "WhatsApp Sent"];
    const rows = guests.map((g) => [
      g.id, g.firstName, g.familyName, g.fullPhone, g.group,
      g.tableNumber ?? "", g.seatNumber ?? "",
      g.registeredAt, g.checkedInAt ?? "", g.whatsappSent ? "Yes" : "No",
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "guests.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const allNavItems = [
    { id: "landing", label: t.nav.card },
    { id: "register", label: t.nav.register },
    { id: "admin", label: t.nav.admin },
    { id: "scanner", label: t.nav.scanner },
  ];
  const navItems = authRole === "viewer"
    ? allNavItems.filter((x) => x.id === "scanner")
    : allNavItems;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cinzel:wght@400;500;600&family=Great+Vibes&family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{background:#ffffff;}
    body{
      background:
        linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(250,250,247,0.9) 40%, rgba(245,242,232,0.9) 100%),
        radial-gradient(circle at 20% 10%, rgba(232,238,222,0.4), transparent 40%),
        radial-gradient(circle at 80% 90%, rgba(232,238,222,0.4), transparent 40%),
        #ffffff;
      min-height:100vh;
    }
    .serif{font-family:'Cormorant Garamond',Georgia,serif;}
    .script{font-family:'Great Vibes',cursive;}
    .cinzel{font-family:'Cinzel',serif;}
    .ar-d{font-family:'Aref Ruqaa','Amiri',serif;}
    .ar-b{font-family:'Aref Ruqaa','Amiri',serif;}
    .ital{font-family:'Cormorant Garamond',serif;font-style:italic;}

    .field-wrap{display:flex;flex-direction:column;gap:8px;}
    .field-label{font-family:'Cinzel',serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${C.mid};font-weight:500;}
    .field-label-ar{font-family:'Aref Ruqaa','Amiri',serif;font-size:14px;letter-spacing:0;color:${C.mid};font-weight:600;}
    .input-box{width:100%;padding:16px 20px;border:1.5px solid ${C.border};border-radius:4px;background:${C.inputBg};font-family:'Cormorant Garamond',serif;font-size:20px;color:${C.dark};outline:none;transition:border-color .25s,box-shadow .25s;line-height:1.3;}
    .input-box:focus{border-color:${C.dark};box-shadow:0 0 0 3px rgba(45,74,45,.1);}
    .input-box::placeholder{color:#bbb;font-style:italic;font-size:18px;}
    .input-box.ar-b{font-family:'Aref Ruqaa','Amiri',serif;font-size:18px;}
    select.input-box{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath d='M1 4L6 9L11 4' stroke='%234a6b3a' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:40px;}
    [dir=rtl] select.input-box{background-position:left 16px center;padding-right:20px;padding-left:40px;}
    .field-error{font-family:'Cormorant Garamond',serif;font-size:15px;color:#b91c1c;font-style:italic;padding:6px 0;}
    .field-hint{font-family:'Cormorant Garamond',serif;font-size:15px;color:${C.muted};font-style:italic;}
    .field-hint-ar{font-family:'Aref Ruqaa',serif;font-size:14px;color:${C.muted};}

    .btn-p{background:${C.dark};color:#fff;padding:18px 40px;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:13px;letter-spacing:.2em;transition:background .3s;border-radius:3px;}
    .btn-p:hover{background:${C.mid};}
    .btn-p:disabled{background:#ccc;cursor:not-allowed;}
    .btn-p-ar{font-family:'Aref Ruqaa',serif;font-size:16px;letter-spacing:0;}
    .btn-s{background:transparent;color:${C.dark};border:1.5px solid ${C.dark};padding:16px 36px;cursor:pointer;font-family:'Cinzel',serif;font-size:12px;letter-spacing:.18em;transition:all .3s;border-radius:3px;}
    .btn-s:hover{background:${C.dark};color:#fff;}

    .nav-btn{background:transparent;border:none;cursor:pointer;font-family:'Cinzel',serif;letter-spacing:.18em;font-size:12px;padding-bottom:4px;transition:all .3s;}

    tr:hover td{background:rgba(122,154,106,.07);}
    .act-link{background:none;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;letter-spacing:.12em;color:${C.mid};text-decoration:underline;text-underline-offset:3px;padding:4px 0;}
    .act-link:hover{color:${C.dark};}

    .gold-s{width:64px;height:1px;background:${C.gold};margin:0 auto;}

    /* ── Basmala mobile ── */
    .basmala-char{font-size:28px;}
    @media(max-width:520px){
      .basmala-char{font-size:15px !important;}
      .card{padding:24px 16px !important;}
    }

    /* ── RTL global helpers ── */
    [dir=rtl] .field-label{text-align:right;}
    [dir=rtl] .field-hint{text-align:right;}
    [dir=rtl] .field-error{text-align:right;}
    [dir=rtl] .cinzel-title{font-family:'Aref Ruqaa','Amiri',serif;letter-spacing:0;font-size:14px;}

    @keyframes fi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    .fi{animation:fi .7s ease both;}
    .fi1{animation:fi .6s .1s ease both;}
    .fi2{animation:fi .6s .22s ease both;}
    .fi3{animation:fi .6s .38s ease both;}
    .fi4{animation:fi .6s .52s ease both;}
    .fi5{animation:fi .6s .66s ease both;}

    .card{background:rgba(255,255,255,0.92);border:1px solid ${C.border};padding:40px;}

    /* Floral page header / footer */
    .page-header{position:relative;}
    .page-footer{position:relative;}
  `;

  return (
    <div
      dir={t.dir}
      style={{
        minHeight: "100vh",
        color: C.dark,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{css}</style>

      {/* Top floral header — matches the invitation card */}
      <div className="page-header">
        <FloralHeader position="top" />
      </div>

      {/* Sticky nav (sits below the floral header) */}
      <nav
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "14px 28px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 8px rgba(0,0,0,.04)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                border: `1.5px solid ${C.gold}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
              }}
            >
              <span
                className="script"
                style={{ fontSize: 26, color: C.dark, lineHeight: 1 }}
              >
                M<span style={{ color: C.gold, fontSize: 20 }}>&</span>D
              </span>
            </div>
            <div>
              <div
                className="cinzel"
                style={{ fontSize: 12, color: C.mid, letterSpacing: ".2em" }}
              >
                MAJD · DANA
              </div>
              <div className="ital" style={{ fontSize: 13, color: C.muted }}>
                01 · 07 · 2026
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {navItems.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className="nav-btn"
                style={{
                  color: view === item.id ? C.dark : C.muted,
                  fontWeight: view === item.id ? 600 : 400,
                  borderBottom:
                    view === item.id
                      ? `2px solid ${C.dark}`
                      : "2px solid transparent",
                }}
              >
                {lang === "ar" ? (
                  <span
                    className="ar-b"
                    style={{ fontSize: 14, letterSpacing: 0 }}
                  >
                    {item.label}
                  </span>
                ) : (
                  `${String(i + 1).padStart(2, "0")} · ${item.label}`
                )}
              </button>
            ))}
            <button
              onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
              style={{
                background: "transparent",
                color: C.mid,
                border: `1px solid ${C.gold}`,
                padding: "6px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 3,
              }}
            >
              <Globe size={13} color={C.gold} />
              <span
                className="cinzel"
                style={{ fontSize: 11, letterSpacing: ".1em" }}
              >
                {lang === "en" ? "عربي" : "EN"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "52px 24px 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {view === "landing" && (
          <LandingView
            t={t}
            lang={lang}
            onRegister={() => setView("register")}
          />
        )}
        {view === "register" && (
          <RegistrationView
            t={t}
            lang={lang}
            guests={guests}
            addGuest={addGuest}
          />
        )}
        {view === "admin" && (
          <AdminView
            t={t}
            lang={lang}
            guests={guests}
            guestsLoading={guestsLoading}
            updateGuest={updateGuest}
            deleteGuest={deleteGuest}
            exportCSV={exportCSV}
            refreshGuests={refreshGuests}
            auth={isAdminAuth}
            setAuth={(v: boolean) => setAuthRole(v ? "admin" : "none")}
          />
        )}
        {view === "scanner" && (
          <ScannerView
            t={t}
            lang={lang}
            guests={guests}
            updateGuest={updateGuest}
            refreshGuests={refreshGuests}
            authRole={authRole}
            setAuthRole={setAuthRole}
          />
        )}
      </div>

      {/* Bottom floral footer — matches the invitation card */}
      <div className="page-footer">
        <FloralHeader position="bottom" />
      </div>

      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "28px",
          textAlign: "center",
          background: "rgba(255,255,255,0.85)",
        }}
      >
        <div className="gold-s" style={{ marginBottom: 14 }}></div>
        <div className="script" style={{ fontSize: 30, color: C.dark }}>
          Majd <span style={{ color: C.gold }}>&</span> Dana
        </div>
        <div
          className="cinzel"
          style={{
            fontSize: 11,
            color: C.muted,
            marginTop: 6,
            letterSpacing: ".2em",
          }}
        >
          THE RITZ-CARLTON · AMMAN · MMXXVI
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────────────── LANDING ──────────────────────────── */
function LandingView({ t, lang, onRegister }: any) {
  const isAr = lang === "ar";
  return (
    <div className="fi" style={{ position: "relative" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            position: "relative",
            border: `1px solid ${C.border}`,
            boxShadow: "0 8px 40px rgba(45,74,45,.08)",
          }}
        >
          <div style={{ padding: "40px 52px 48px", textAlign: "center" }}>
            <div className="fi1" style={{ marginBottom: 20 }}>
              {isAr ? (
                <div
                  className="ar-d basmala-char"
                  style={{ color: C.dark, lineHeight: 1.7 }}
                >
                  ﷽
                </div>
              ) : (
                <div className="ital" style={{ fontSize: 15, color: C.mid }}>
                  {t.landing.bismillah}
                </div>
              )}
            </div>

            <div className="fi1" style={{ marginBottom: 24 }}>
              {isAr ? (
                <div
                  className="ar-d"
                  style={{
                    fontSize: 27,
                    color: C.dark,
                    fontWeight: 700,
                    lineHeight: 1.7,
                  }}
                >
                  ﴿ {t.landing.verse} ﴾
                </div>
              ) : (
                <div
                  className="ital"
                  style={{
                    fontSize: 17,
                    color: C.dark,
                    lineHeight: 1.7,
                    maxWidth: 380,
                    margin: "0 auto",
                  }}
                >
                  "{t.landing.verse}"
                </div>
              )}
            </div>

            <div className="fi2 gold-s" style={{ marginBottom: 24 }}></div>

            <div className="fi2" style={{ marginBottom: 20 }}>
              {isAr ? (
                <div className="ar-b" style={{ fontSize: 16, color: C.mid }}>
                  {t.landing.together}
                </div>
              ) : (
                <div
                  className="cinzel"
                  style={{ fontSize: 11, color: C.mid, letterSpacing: ".2em" }}
                >
                  {t.landing.together}
                </div>
              )}
            </div>

            <div
              className="fi2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: 16,
                alignItems: "center",
                marginBottom: 28,
              }}
            >
              {[
                ["groomFamily", "groomName", "groomHouse"],
                ["brideFamily", "brideName", "brideHouse"],
              ].map((keys, idx) => (
                <React.Fragment key={idx}>
                  {idx === 1 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{ width: 1, height: 28, background: C.gold }}
                      ></div>
                      <div
                        className="serif"
                        style={{ fontSize: 20, color: C.gold }}
                      >
                        &
                      </div>
                      <div
                        style={{ width: 1, height: 28, background: C.gold }}
                      ></div>
                    </div>
                  )}
                  <div style={{ textAlign: "center" }}>
                    {isAr ? (
                      <>
                        <div
                          className="ar-b"
                          style={{
                            fontSize: 13,
                            color: C.mid,
                            marginBottom: 4,
                          }}
                        >
                          {t.landing[keys[0]]}
                        </div>
                        <div
                          className="ar-d"
                          style={{
                            fontSize: 18,
                            color: C.dark,
                            fontWeight: 700,
                            lineHeight: 1.5,
                          }}
                        >
                          {t.landing[keys[1]]}
                        </div>
                        <div
                          className="ar-d"
                          style={{ fontSize: 15, color: C.gold, marginTop: 2 }}
                        >
                          {t.landing[keys[2]]}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="cinzel"
                          style={{
                            fontSize: 9,
                            color: C.mid,
                            letterSpacing: ".15em",
                            marginBottom: 4,
                          }}
                        >
                          {t.landing[keys[0]]}
                        </div>
                        <div
                          className="serif"
                          style={{
                            fontSize: 17,
                            color: C.dark,
                            lineHeight: 1.3,
                          }}
                        >
                          {t.landing[keys[1]]}
                        </div>
                        <div
                          className="ital"
                          style={{ fontSize: 14, color: C.gold, marginTop: 2 }}
                        >
                          {t.landing[keys[2]]}
                        </div>
                      </>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="fi3" style={{ marginBottom: 24 }}>
              {isAr ? (
                <div
                  className="ar-b"
                  style={{ fontSize: 17, color: C.dark, lineHeight: 1.8 }}
                >
                  {t.landing.invite}
                </div>
              ) : (
                <div
                  className="ital"
                  style={{ fontSize: 16, color: C.dark, lineHeight: 1.7 }}
                >
                  {t.landing.invite}
                </div>
              )}
            </div>

            <div className="fi3" style={{ margin: "28px 0" }}>
              {isAr ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 20,
                  }}
                >
                  <div
                    className="ar-d"
                    style={{
                      fontSize: 84,
                      color: C.gold,
                      lineHeight: 1,
                      fontWeight: 400,
                    }}
                  >
                    {t.landing.groom}
                  </div>
                  <div
                    className="ar-d"
                    style={{ fontSize: 42, color: C.gold, lineHeight: 1 }}
                  >
                    و
                  </div>
                  <div
                    className="ar-d"
                    style={{
                      fontSize: 84,
                      color: C.gold,
                      lineHeight: 1,
                      fontWeight: 400,
                    }}
                  >
                    {t.landing.bride}
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="script"
                    style={{ fontSize: 106, color: C.gold, lineHeight: 0.85 }}
                  >
                    {t.landing.groom}
                  </div>
                  <div
                    className="script"
                    style={{
                      fontSize: 54,
                      color: C.gold,
                      margin: "-4px 0",
                      lineHeight: 1,
                    }}
                  >
                    &
                  </div>
                  <div
                    className="script"
                    style={{ fontSize: 106, color: C.gold, lineHeight: 0.85 }}
                  >
                    {t.landing.bride}
                  </div>
                </div>
              )}
            </div>

            <div className="fi3" style={{ marginBottom: 28 }}>
              {isAr ? (
                <div className="ar-b" style={{ fontSize: 16, color: C.mid }}>
                  {t.landing.willing}
                </div>
              ) : (
                <div className="ital" style={{ fontSize: 14, color: C.mid }}>
                  {t.landing.willing}
                </div>
              )}
            </div>

            <div className="fi4 gold-s" style={{ marginBottom: 24 }}></div>

            <div
              className="fi4"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
                marginBottom: 24,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {[
                ["🕖", t.landing.time, "TIME"],
                ["📍", t.landing.venue, t.landing.city],
                ["📅", "1. 7. 2026", "DATE"],
              ].map(([icon, main, sub], i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div style={{ background: C.border }}></div>}
                  <div
                    style={{
                      padding: "20px 12px",
                      textAlign: "center",
                      background: "#fafaf7",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                    <div
                      className={isAr ? "ar-b" : "serif"}
                      style={{
                        fontSize: isAr ? 15 : 17,
                        color: C.dark,
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {main}
                    </div>
                    <div
                      className="cinzel"
                      style={{
                        fontSize: 9,
                        color: C.muted,
                        marginTop: 4,
                        letterSpacing: ".12em",
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div
              className="fi4"
              style={{
                fontSize: isAr ? 15 : 13,
                color: C.muted,
                marginBottom: 28,
                padding: "12px 20px",
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                background: "#fafaf7",
                fontStyle: isAr ? "normal" : "italic",
                fontFamily: isAr
                  ? "Aref Ruqaa,serif"
                  : "Cormorant Garamond,serif",
              }}
            >
              {t.landing.childrenNotice}
            </div>

            <div className="fi5">
              <div
                className="cinzel"
                style={{
                  fontSize: 11,
                  color: C.mid,
                  marginBottom: 4,
                  letterSpacing: ".2em",
                }}
              >
                {t.landing.rsvpTitle}
              </div>
              <div
                style={{
                  fontSize: isAr ? 15 : 14,
                  color: C.muted,
                  marginBottom: 20,
                  fontStyle: isAr ? "normal" : "italic",
                  fontFamily: isAr
                    ? "Aref Ruqaa,serif"
                    : "Cormorant Garamond,serif",
                }}
              >
                {t.landing.rsvpDeadline}
              </div>
              <button
                onClick={onRegister}
                className="btn-p"
                style={{ minWidth: 240, fontSize: 13 }}
              >
                {isAr ? (
                  <span className="btn-p-ar">{t.landing.cta}</span>
                ) : (
                  t.landing.cta
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── COUNTRY SELECT ──────────────────────────── */
function CountrySelect({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = ALLOWED_COUNTRIES.find(c => c.code === value) || ALLOWED_COUNTRIES[0];
  const filtered = ALLOWED_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.code.includes(query)
  );

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0, width: 118 }}>
      <button
        type="button"
        onClick={() => { if (!disabled) setOpen(o => !o); }}
        disabled={disabled}
        className="input-box"
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, fontSize: 16, padding: "16px 10px", cursor: disabled ? "not-allowed" : "pointer", textAlign: "left" }}
      >
        <span style={{ fontSize: 18 }}>{selected.flag}</span>
        <span style={{ fontFamily: "monospace", fontSize: 13 }}>{selected.code}</span>
        <ChevronDown size={11} style={{ marginLeft: "auto", flexShrink: 0, color: C.mid }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 400, background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 4, width: 250, maxHeight: 280, display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search country or code…"
            style={{ border: "none", borderBottom: `1px solid ${C.border}`, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "Cormorant Garamond,serif" }}
          />
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.map(c => (
              <button
                key={c.code + c.name}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); setQuery(""); }}
                style={{ width: "100%", textAlign: "left", padding: "8px 14px", background: c.code === value ? "#f5f2e8" : "transparent", border: "none", borderBottom: `1px solid #f5f2e8`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "Cormorant Garamond,serif" }}
              >
                <span style={{ fontSize: 17 }}>{c.flag}</span>
                <span style={{ color: C.mid, fontSize: 12, fontFamily: "monospace", flexShrink: 0 }}>{c.code}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── REGISTRATION ──────────────────────────── */
function RegistrationView({ t, lang, guests, addGuest }: any) {
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [countryCode, setCountryCode] = useState("+962");
  const [mobile, setMobile] = useState("");
  const [group, setGroup] = useState("Family of the Groom · Al-Nawfal");
  const [companionCount, setCompanionCount] = useState(0);
  const [companions, setCompanions] = useState<{id: string; name: string; countryCode: string; phone: string}[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState<Guest | null>(null);
  const [sending, setSending] = useState(false);
  const isPast = new Date() > RSVP_DEADLINE;
  const isAr = lang === "ar";

  const handleCompanionCountChange = (n: number) => {
    setCompanionCount(n);
    setCompanions((prev) => {
      const arr = [...prev];
      while (arr.length < n) arr.push({ id: generateId(), name: "", countryCode: "+962", phone: "" });
      return arr.slice(0, n);
    });
  };

  const handleSubmit = async () => {
    const e: any = {};
    if (!firstName.trim()) e.firstName = t.register.required;
    if (!familyName.trim()) e.familyName = t.register.required;
    if (!mobile.trim()) e.mobile = t.register.required;
    else if (!validatePhone(countryCode, mobile)) e.mobile = t.register.invalid;
    const fp = `${countryCode}${mobile.replace(/\D/g, "")}`;
    if (guests.find((g: Guest) => g.fullPhone === fp))
      e.mobile = t.register.duplicate;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const ng: Guest = {
      id: generateId(),
      firstName: firstName.trim(),
      familyName: familyName.trim(),
      countryCode,
      mobile: mobile.replace(/\D/g, ""),
      fullPhone: fp,
      seatNumber: null,
      tableNumber: null,
      group,
      registeredAt: new Date().toISOString(),
      checkedInAt: null,
      whatsappSent: false,
    };
    addGuest(ng);
    setSending(true);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ng.id,
          firstName: ng.firstName,
          familyName: ng.familyName,
          countryCode: ng.countryCode,
          mobile: ng.mobile,
          fullPhone: ng.fullPhone,
          group: ng.group,
          lang,
          companions: companions.filter(c => c.name.trim()).map(c => ({ id: c.id, firstName: c.name.trim(), familyName: "", countryCode: c.countryCode, phone: c.phone })),
        }),
      });
    } catch { /* ignore network errors — guest is already saved optimistically */ } finally {
      setSending(false);
      setSubmitted(ng);
    }
  };

  const totalSeats = 1 + companions.length;

  if (submitted)
    return (
      <div
        className="fi"
        style={{ maxWidth: 540, margin: "40px auto", textAlign: "center" }}
      >
        <CheckCircle2
          size={52}
          color={C.light}
          strokeWidth={1.5}
          style={{ margin: "0 auto 20px" }}
        />
        <div
          className={isAr ? "ar-b" : "ital"}
          style={{ fontSize: isAr ? 20 : 19, color: C.mid, marginBottom: 8 }}
        >
          {t.register.thankYou}
        </div>
        <div
          className="script"
          style={{
            fontSize: 72,
            color: C.dark,
            lineHeight: 0.9,
            marginBottom: 20,
          }}
        >
          {submitted.firstName}
        </div>
        <div className="gold-s" style={{ marginBottom: 24 }}></div>
        <div
          style={{
            fontSize: isAr ? 16 : 15,
            color: C.muted,
            marginBottom: 16,
            lineHeight: 1.7,
            fontFamily: isAr ? "Aref Ruqaa,Amiri,serif" : "Cormorant Garamond,serif",
            fontStyle: isAr ? "normal" : "italic",
          }}
        >
          {t.register.sentVia}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            background: "#f0f7ec",
            border: `1px solid ${C.light}`,
            borderRadius: 20,
            color: C.dark,
            fontSize: isAr ? 16 : 14,
            fontFamily: isAr ? "Aref Ruqaa,Amiri,serif" : "Cormorant Garamond,serif",
            fontStyle: isAr ? "normal" : "italic",
            marginBottom: 24,
          }}
        >
          <CheckCircle2 size={14} color={C.light} />
          {t.register.reservedSeats(totalSeats)}
        </div>
        {/* Main guest QR card */}
        <div
          className="card"
          style={{ textAlign: "center", borderColor: C.border, marginBottom: 20 }}
        >
          <div
            className="cinzel"
            style={{ fontSize: 12, color: C.mid, marginBottom: 10, letterSpacing: ".2em" }}
          >
            {t.register.yourQR}
          </div>
          <div
            style={{
              fontSize: isAr ? 16 : 15,
              color: C.muted,
              marginBottom: 24,
              fontFamily: isAr ? "Aref Ruqaa,serif" : "Cormorant Garamond,serif",
              fontStyle: isAr ? "normal" : "italic",
            }}
          >
            {t.register.yourName} ·{" "}
            <strong style={{ color: C.dark, fontStyle: "normal" }}>
              {submitted.firstName} {submitted.familyName}
            </strong>
          </div>
          <div
            style={{
              border: `1px solid ${C.border}`,
              display: "inline-block",
              padding: 16,
              background: "#fff",
              marginBottom: 16,
              borderRadius: 4,
            }}
          >
            <RealQRCode value={submitted.id} size={190} />
          </div>
          <div className="gold-s" style={{ marginBottom: 12 }}></div>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>
            REF · {submitted.id}
          </div>
        </div>

        {/* Companion QR cards */}
        {companions.map((c, idx) => (
          <div
            key={c.id}
            className="card"
            style={{ textAlign: "center", borderColor: C.border, marginBottom: 20 }}
          >
            <div
              className="cinzel"
              style={{ fontSize: 12, color: C.mid, marginBottom: 10, letterSpacing: ".2em" }}
            >
              {isAr ? `بطاقة المرافق ${idx + 1}` : `COMPANION ${idx + 1} PASS`}
            </div>
            <div
              style={{
                fontSize: isAr ? 16 : 15,
                color: C.muted,
                marginBottom: 24,
                fontFamily: isAr ? "Aref Ruqaa,serif" : "Cormorant Garamond,serif",
                fontStyle: isAr ? "normal" : "italic",
              }}
            >
              {t.register.yourName} ·{" "}
              <strong style={{ color: C.dark, fontStyle: "normal" }}>
                {c.name || (isAr ? "مرافق" : "Companion")}
              </strong>
            </div>
            <div
              style={{
                border: `1px solid ${C.border}`,
                display: "inline-block",
                padding: 16,
                background: "#fff",
                marginBottom: 16,
                borderRadius: 4,
              }}
            >
              <RealQRCode value={c.id} size={190} />
            </div>
            <div className="gold-s" style={{ marginBottom: 12 }}></div>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>
              REF · {c.id}
            </div>
          </div>
        ))}

        <div
          style={{
            fontSize: isAr ? 15 : 14,
            color: C.muted,
            marginTop: 24,
            lineHeight: 1.8,
            fontFamily: isAr ? "Aref Ruqaa,serif" : "Cormorant Garamond,serif",
            fontStyle: isAr ? "normal" : "italic",
          }}
        >
          {t.register.testNote}
        </div>
      </div>
    );

  return (
    <div className="fi" style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          className="cinzel fi1"
          style={{
            fontSize: 11,
            color: C.mid,
            marginBottom: 12,
            letterSpacing: ".25em",
          }}
        >
          {t.register.chapter}
        </div>
        <div
          className={`fi2 ${isAr ? "ar-d" : "script"}`}
          style={{
            fontSize: isAr ? 44 : 76,
            color: C.dark,
            lineHeight: isAr ? 1.2 : 0.9,
            marginBottom: 12,
          }}
        >
          {t.register.title}
        </div>
        <div
          className="fi2"
          style={{
            fontSize: 16,
            color: C.muted,
            fontFamily: isAr ? "Aref Ruqaa,serif" : "Cormorant Garamond,serif",
            fontStyle: isAr ? "normal" : "italic",
            lineHeight: 1.6,
          }}
        >
          {t.register.subtitle}
        </div>
        <div className="gold-s fi3" style={{ marginTop: 20 }}></div>
      </div>

      {isPast && (
        <div
          style={{
            padding: "16px 20px",
            background: "#fff9ec",
            border: `1px solid ${C.gold}`,
            borderRadius: 4,
            marginBottom: 36,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <AlertCircle size={18} color={C.gold} />
          <div
            style={{
              fontSize: 16,
              color: C.gold,
              fontFamily: isAr ? "Aref Ruqaa,serif" : "Cormorant Garamond,serif",
              fontStyle: isAr ? "normal" : "italic",
            }}
          >
            {t.register.past}
          </div>
        </div>
      )}

      <div
        className="fi3"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: "40px 44px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
          boxShadow: "0 2px 16px rgba(45,74,45,.07)",
        }}
      >
        <div className="field-wrap">
          <label className={isAr ? "field-label-ar" : "field-label"}>
            {isAr ? "" : "01 · "}
            {t.register.firstName}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`input-box${isAr ? " ar-b" : ""}`}
            placeholder={isAr ? "محمد" : "e.g. Mohammad"}
            disabled={isPast}
          />
          {errors.firstName && (
            <div className="field-error">{errors.firstName}</div>
          )}
        </div>

        <div className="field-wrap">
          <label className={isAr ? "field-label-ar" : "field-label"}>
            {isAr ? "" : "02 · "}
            {t.register.familyName}
          </label>
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className={`input-box${isAr ? " ar-b" : ""}`}
            placeholder={isAr ? "أبو شامية" : "e.g. Abu Shamieh"}
            disabled={isPast}
          />
          {errors.familyName && (
            <div className="field-error">{errors.familyName}</div>
          )}
        </div>

        <div className="field-wrap">
          <label className={isAr ? "field-label-ar" : "field-label"}>
            {isAr ? "" : "03 · "}
            {t.register.mobile}
          </label>
          <div
            style={{ display: "flex", gap: 10, alignItems: "stretch" }}
            dir="ltr"
          >
            <CountrySelect value={countryCode} onChange={setCountryCode} disabled={isPast} />
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="input-box"
              placeholder="79 123 4567"
              disabled={isPast}
              style={{ flex: 1 }}
            />
          </div>
          <div className={isAr ? "field-hint-ar" : "field-hint"}>
            {t.register.mobileHint}
          </div>
          {errors.mobile && <div className="field-error">{errors.mobile}</div>}
        </div>

        <div className="field-wrap">
          <label className={isAr ? "field-label-ar" : "field-label"}>
            {isAr ? "" : "04 · "}
            {t.register.guestOf}
          </label>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className={`input-box${isAr ? " ar-b" : ""}`}
            disabled={isPast}
          >
            <option value="Family of the Groom · Al-Nawfal">
              {t.register.groupGroom}
            </option>
            <option value="Family of the Bride · Al-Thabta">
              {t.register.groupBride}
            </option>
            <option value="Friends">{t.register.groupFriends}</option>
            <option value="Colleagues">{t.register.groupColleagues}</option>
          </select>
        </div>

        {/* Companion count */}
        <div className="field-wrap">
          <label className={isAr ? "field-label-ar" : "field-label"}>
            {isAr ? "" : "05 · "}
            {t.register.companions}
          </label>
          <select
            value={companionCount}
            onChange={(e) => handleCompanionCountChange(Number(e.target.value))}
            className={`input-box${isAr ? " ar-b" : ""}`}
            disabled={isPast}
          >
            {[0,1,2,3,4].map((n) => (
              <option key={n} value={n}>{n === 0 ? (isAr ? "لا يوجد مرافقون" : "None – just me") : `${n}`}</option>
            ))}
          </select>
          <div className={isAr ? "field-hint-ar" : "field-hint"}>{t.register.companionsHint}</div>
        </div>

        {/* Companion forms */}
        {companions.map((c, idx) => (
          <div key={idx} style={{ background: "#fafaf7", border: `1px solid ${C.border}`, borderRadius: 4, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: isAr ? 15 : 11, color: C.mid, fontFamily: isAr ? "Aref Ruqaa,Amiri,serif" : "Cinzel,serif", letterSpacing: isAr ? 0 : ".15em" }}>
              {isAr ? `المرافق ${idx + 1}` : `Companion ${idx + 1}`}
            </div>
            <div className="field-wrap">
              <label className={isAr ? "field-label-ar" : "field-label"}>{t.register.companionName}</label>
              <input
                type="text"
                value={c.name}
                onChange={(e) => setCompanions((p) => p.map((x, i) => i === idx ? {...x, name: e.target.value} : x))}
                className={`input-box${isAr ? " ar-b" : ""}`}
                disabled={isPast}
                placeholder={isAr ? "الاسم الكامل" : "Full name"}
              />
            </div>
            <div className="field-wrap">
              <label className={isAr ? "field-label-ar" : "field-label"}>{t.register.companionPhone}</label>
              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }} dir="ltr">
                <CountrySelect
                  value={c.countryCode}
                  onChange={(val) => setCompanions((p) => p.map((x, i) => i === idx ? {...x, countryCode: val} : x))}
                  disabled={isPast}
                />
                <input
                  type="tel"
                  value={c.phone}
                  onChange={(e) => setCompanions((p) => p.map((x, i) => i === idx ? {...x, phone: e.target.value} : x))}
                  className="input-box"
                  placeholder="79 123 4567"
                  disabled={isPast}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        ))}

        <div style={{ paddingTop: 8, textAlign: "center" }}>
          <button
            onClick={handleSubmit}
            className="btn-p"
            disabled={isPast || sending}
            style={{ width: "100%", fontSize: 14, padding: "20px" }}
          >
            {sending ? (
              isAr ? (
                <span className="btn-p-ar">جاري الحفظ…</span>
              ) : (
                "Saving…"
              )
            ) : isAr ? (
              <span className="btn-p-ar">{t.register.submit}</span>
            ) : (
              t.register.submit
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── LOGIN ──────────────────────────── */
function LoginGate({ t, lang, onSuccess, allowViewer = false }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const isAr = lang === "ar";
  const handle = () => {
    if (username.trim() === "admin" && password === "wedding2026") {
      setError(false);
      onSuccess("admin");
    } else if (allowViewer && username.trim() === "viewer" && password === "password00") {
      setError(false);
      onSuccess("viewer");
    } else setError(true);
  };
  return (
    <div
      className="fi"
      style={{ maxWidth: 440, margin: "60px auto", textAlign: "center" }}
    >
      <div
        className="cinzel fi1"
        style={{
          fontSize: 11,
          color: C.mid,
          marginBottom: 12,
          letterSpacing: ".22em",
        }}
      >
        {isAr ? (
          <span className="ar-b" style={{ letterSpacing: 0, fontSize: 14 }}>
            {t.login.chapter}
          </span>
        ) : (
          t.login.chapter
        )}
      </div>
      <div
        className={`fi2 ${isAr ? "ar-d" : "serif"}`}
        style={{
          fontSize: isAr ? 38 : 42,
          color: C.dark,
          lineHeight: 1.1,
          marginBottom: 10,
        }}
      >
        {t.login.title}
      </div>
      <div
        className="fi2"
        style={{
          fontSize: 15,
          color: C.muted,
          fontFamily: isAr ? "Aref Ruqaa,serif" : "Cormorant Garamond,serif",
          fontStyle: isAr ? "normal" : "italic",
          marginBottom: 32,
        }}
      >
        {t.login.subtitle}
      </div>
      <div className="gold-s fi3" style={{ marginBottom: 36 }}></div>

      <div
        className="fi3"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          padding: "36px 40px",
          textAlign: "left",
          boxShadow: "0 2px 16px rgba(45,74,45,.07)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {[
          ["username", t.login.username, "text", username, setUsername],
          ["password", t.login.password, "password", password, setPassword],
        ].map(([key, label, type, val, setter]: any) => (
          <div className="field-wrap" key={key}>
            <label className={isAr ? "field-label-ar" : "field-label"}>
              {isAr ? "" : key === "username" ? "01 · " : "02 · "}
              {isAr ? <span className="ar-b">{label}</span> : label}
            </label>
            <input
              type={type}
              value={val}
              onChange={(e) => {
                setter(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              className={`input-box${isAr ? " ar-b" : ""}`}
              autoFocus={key === "username"}
            />
          </div>
        ))}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "#fff5f5",
              border: "1px solid #fcc",
              borderRadius: 4,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <AlertCircle size={16} color="#b91c1c" />
            <div
              style={{
                fontSize: 15,
                color: "#b91c1c",
                fontFamily: "Cormorant Garamond,serif",
                fontStyle: "italic",
              }}
            >
              {t.login.error}
            </div>
          </div>
        )}
        <button
          onClick={handle}
          className="btn-p"
          style={{ width: "100%", fontSize: 13 }}
        >
          {isAr ? (
            <span className="btn-p-ar">{t.login.submit}</span>
          ) : (
            t.login.submit
          )}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────── ADMIN ──────────────────────────── */
function AdminView({ t, lang, guests, guestsLoading, updateGuest, deleteGuest, exportCSV, refreshGuests, auth, setAuth }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selGuest, setSelGuest] = useState<Guest | null>(null);
  const [viewQR, setViewQR] = useState<Guest | null>(null);
  const [seatSaving, setSeatSaving] = useState(false);
  const [sortCol, setSortCol] = useState<string>("registeredAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [tableNames, setTableNames] = useState<Record<number, string>>(() => {
    try { return JSON.parse(localStorage.getItem("wedding_table_names") || "{}"); } catch { return {}; }
  });
  const [renamingTable, setRenamingTable] = useState<number | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const isAr = lang === "ar";

  const saveTableName = (tn: number, name: string) => {
    const updated = { ...tableNames, [tn]: name.trim() };
    setTableNames(updated);
    localStorage.setItem("wedding_table_names", JSON.stringify(updated));
    setRenamingTable(null);
  };
  if (!auth)
    return <LoginGate t={t} lang={lang} onSuccess={(role: string) => setAuth(role === "admin")} />;

  const colKeys = ["name", "fullPhone", "group", "seat", "status", "whatsapp"];

  const primaryGuests = guests.filter((g: Guest) => !g.primaryGuestId);
  const getCompanions = (primaryId: string) => guests.filter((g: Guest) => g.primaryGuestId === primaryId);

  const matchesSearch = (g: Guest) =>
    `${g.firstName} ${g.familyName} ${g.fullPhone}`.toLowerCase().includes(search.toLowerCase());

  const matchesFilter = (g: Guest) => {
    if (filter === "assigned") return g.tableNumber !== null;
    if (filter === "unassigned") return g.tableNumber === null;
    if (filter === "attended") return g.checkedInAt !== null;
    return true;
  };

  const filtered = primaryGuests
    .filter((g: Guest) => {
      const companions = getCompanions(g.id);
      const selfMatch = matchesSearch(g) && matchesFilter(g);
      const companionMatch = companions.some((c) => matchesSearch(c) && matchesFilter(c));
      return selfMatch || companionMatch;
    })
    .sort((a: Guest, b: Guest) => {
      let av: any, bv: any;
      if (sortCol === "name") { av = `${a.firstName} ${a.familyName}`; bv = `${b.firstName} ${b.familyName}`; }
      else if (sortCol === "fullPhone") { av = a.fullPhone; bv = b.fullPhone; }
      else if (sortCol === "group") { av = a.group; bv = b.group; }
      else if (sortCol === "seat") { av = a.tableNumber ?? 9999; bv = b.tableNumber ?? 9999; }
      else if (sortCol === "status") { av = a.checkedInAt ?? ""; bv = b.checkedInAt ?? ""; }
      else if (sortCol === "whatsapp") { av = a.whatsappSent ? 1 : 0; bv = b.whatsappSent ? 1 : 0; }
      else { av = a.registeredAt; bv = b.registeredAt; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const resendPass = async (g: Guest) => {
    setResendingId(g.id);
    try {
      const r = await fetch(`/api/guests/${g.id}/resend`, { method: "POST" });
      const data = await r.json().catch(() => ({}));
      if (data.ok) updateGuest(g.id, { whatsappSent: true });
      await refreshGuests();
    } catch { /* ignore */ } finally {
      setResendingId(null);
    }
  };
  const stats = {
    total: guests.length,
    assigned: guests.filter((g: Guest) => g.tableNumber !== null).length,
    attended: guests.filter((g: Guest) => g.checkedInAt !== null).length,
    unassigned: guests.filter((g: Guest) => g.tableNumber === null && !g.primaryGuestId).length,
  };
  const assignSeat = async (id: string, tn: number, sn: number) => {
    setSeatSaving(true);
    updateGuest(id, { tableNumber: tn, seatNumber: sn });
    setSelGuest(null);
    try {
      await fetch(`/api/guests/${id}/seat`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber: tn, seatNumber: sn }),
      });
      await refreshGuests();
    } catch {
      /* keep optimistic update */
    } finally {
      setSeatSaving(false);
    }
  };
  const getOcc = (tn: number) =>
    guests
      .filter((g: Guest) => g.tableNumber === tn)
      .map((g: Guest) => g.seatNumber);

  return (
    <div className="fi">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 40,
        }}
      >
        <div>
          <div
            className={isAr ? "ar-b fi1 cinzel-title" : "cinzel fi1"}
            style={{
              fontSize: isAr ? 14 : 11,
              color: C.mid,
              marginBottom: 10,
              letterSpacing: isAr ? 0 : ".2em",
            }}
          >
            {t.admin.chapter}
          </div>
          <div
            className={`fi2 ${isAr ? "ar-d" : "serif"}`}
            style={{ fontSize: isAr ? 40 : 50, color: C.dark, lineHeight: 1 }}
          >
            {t.admin.title}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={exportCSV}
            className="btn-s"
            style={{ fontSize: 11, padding: "10px 20px" }}
          >
            {isAr ? <span className="ar-b">تصدير CSV</span> : "Export CSV"}
          </button>
          <button
            onClick={refreshGuests}
            className="btn-s"
            style={{ fontSize: 11, padding: "10px 20px" }}
          >
            {isAr ? <span className="ar-b">تحديث</span> : "Refresh"}
          </button>
          <button
            onClick={() => setAuth(false)}
            className="btn-s"
            style={{ fontSize: 11, padding: "10px 20px" }}
          >
            {t.login.signOut}
          </button>
        </div>
      </div>
      {guestsLoading && (
        <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontFamily: "Cormorant Garamond,serif", fontStyle: "italic", fontSize: 16 }}>
          Loading guest list…
        </div>
      )}

      <div
        className="fi2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 1,
          marginBottom: 40,
          background: C.border,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {[
          [t.admin.total, stats.total, Users],
          [t.admin.assigned, stats.assigned, LayoutGrid],
          [t.admin.unassigned, stats.unassigned, TrendingUp],
          [t.admin.attended, stats.attended, CheckCircle2],
        ].map(([label, val, Icon]: any, i) => (
          <div key={i} style={{ padding: "24px", background: "#fff" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: isAr ? 14 : 11,
                  color: C.mid,
                  fontFamily: isAr ? "Aref Ruqaa,serif" : "Cinzel,serif",
                  letterSpacing: isAr ? 0 : ".15em",
                }}
              >
                {label}
              </div>
              <Icon size={16} color={C.gold} strokeWidth={1.5} />
            </div>
            <div
              className="serif"
              style={{ fontSize: 52, color: C.dark, lineHeight: 1 }}
            >
              {String(val).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

      <div
        className="fi3"
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
          paddingBottom: 16,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search
            size={15}
            style={
              {
                position: "absolute",
                [isAr ? "right" : "left"]: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.mid,
              } as any
            }
          />
          <input
            type="text"
            placeholder={t.admin.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`input-box${isAr ? " ar-b" : ""}`}
            style={
              {
                [isAr ? "paddingRight" : "paddingLeft"]: 46,
                fontSize: 17,
              } as any
            }
          />
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["all", "unassigned", "assigned", "attended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? C.dark : "transparent",
                color: filter === f ? "#fff" : C.muted,
                border: `1px solid ${filter === f ? C.dark : C.border}`,
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: 3,
                fontSize: isAr ? 13 : 11,
                fontFamily: isAr ? "Aref Ruqaa,serif" : "Cinzel,serif",
                letterSpacing: isAr ? 0 : ".1em",
                transition: "all .25s",
              }}
            >
              {t.admin.filters[f]}
            </button>
          ))}
        </div>
      </div>

      <div
        className="fi4"
        style={{ background: "rgba(255,255,255,0.92)", borderRadius: 4 }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              color: C.muted,
              fontSize: 18,
              fontFamily: "Cormorant Garamond,serif",
              fontStyle: "italic",
            }}
          >
            {t.admin.noMatch}
          </div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" } as any}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {t.admin.cols.map((h: string, i: number) => {
                  const key = colKeys[i];
                  const sortable = Boolean(key);
                  const isActive = sortCol === key;
                  return (
                    <th
                      key={i}
                      onClick={() => sortable && toggleSort(key!)}
                      style={{
                        padding: "12px 14px",
                        textAlign: isAr ? "right" : "left",
                        fontFamily: "Cinzel,serif",
                        fontSize: 10,
                        letterSpacing: ".15em",
                        color: isActive ? C.dark : C.mid,
                        fontWeight: isActive ? 700 : 500,
                        cursor: sortable ? "pointer" : "default",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {h}
                        {isActive && (sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.flatMap((g: Guest) => {
                const companions = getCompanions(g.id);
                const renderRow = (row: Guest, isCompanion: boolean) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: `1px solid #eee8d8`,
                      background: isCompanion ? "#fafaf7" : undefined,
                    }}
                  >
                    <td style={{ padding: isCompanion ? "10px 14px 10px 32px" : "16px 14px" }}>
                      {isCompanion && (
                        <div style={{ fontSize: 10, color: C.gold, fontFamily: "Cinzel,serif", letterSpacing: ".12em", marginBottom: 3 }}>
                          {isAr ? `↳ مرافق ${g.firstName} ${g.familyName}` : `↳ with ${g.firstName} ${g.familyName}`}
                        </div>
                      )}
                      <div className="serif" style={{ fontSize: isCompanion ? 17 : 20, color: isCompanion ? C.mid : C.dark }}>
                        {row.firstName} {row.familyName}
                      </div>
                    </td>
                    <td style={{ padding: isCompanion ? "10px 14px" : "16px 14px" }} dir="ltr">
                      <div style={{ fontSize: 14, color: C.muted, fontFamily: "monospace" }}>
                        {row.fullPhone.startsWith("companion-") ? "—" : row.fullPhone}
                      </div>
                    </td>
                    <td style={{ padding: isCompanion ? "10px 14px" : "16px 14px" }}>
                      <div style={{ fontSize: 14, color: C.muted, fontFamily: "Cormorant Garamond,serif", fontStyle: "italic" }}>
                        {row.group}
                      </div>
                    </td>
                    <td style={{ padding: isCompanion ? "10px 14px" : "16px 14px" }}>
                      {row.tableNumber ? (
                        <div className="cinzel" style={{ fontSize: 12, color: C.dark }}>
                          T{String(row.tableNumber).padStart(2, "0")} · S{String(row.seatNumber).padStart(2, "0")}
                        </div>
                      ) : (
                        <div style={{ fontSize: 14, color: "#bbb", fontFamily: "Cormorant Garamond,serif", fontStyle: "italic" }}>
                          {t.admin.notAssigned}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: isCompanion ? "10px 14px" : "16px 14px" }}>
                      {row.checkedInAt ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0f7ec", padding: "4px 10px", borderRadius: 12, fontSize: 12, color: C.light, fontFamily: "Cinzel,serif", letterSpacing: ".1em" }}>
                          <CheckCircle2 size={12} />{t.admin.attendedLabel}
                        </span>
                      ) : (
                        <span style={{ fontSize: 14, color: C.muted, fontFamily: "Cormorant Garamond,serif", fontStyle: "italic" }}>
                          {t.admin.registeredLabel}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: isCompanion ? "10px 14px" : "16px 14px" }}>
                      {row.whatsappSent ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#eaf5e9", padding: "4px 10px", borderRadius: 12, fontSize: 11, color: "#2d6a2d", fontFamily: "Cinzel,serif", letterSpacing: ".08em" }}>
                          <CheckCircle2 size={11} />{isAr ? "أُرسل" : "Sent"}
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff3f3", padding: "4px 10px", borderRadius: 12, fontSize: 11, color: "#b04040", fontFamily: "Cinzel,serif", letterSpacing: ".08em" }}>
                          <XCircle size={11} />{isAr ? "لم يُرسل" : "Not Sent"}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: isCompanion ? "10px 14px" : "16px 14px", textAlign: isAr ? "left" : "right" }}>
                      <div style={{ display: "inline-flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <button onClick={() => setSelGuest(row)} className="act-link">{t.admin.seat}</button>
                        <button onClick={() => setViewQR(row)} className="act-link">{t.admin.qr}</button>
                        <button onClick={() => resendPass(row)} className="act-link" disabled={resendingId === row.id} style={{ color: C.mid, opacity: resendingId === row.id ? 0.5 : 1 }}>
                          {resendingId === row.id ? "…" : t.admin.resend}
                        </button>
                        <button onClick={() => { if (window.confirm(isAr ? `حذف ${row.firstName} ${row.familyName}؟` : `Remove ${row.firstName} ${row.familyName}?`)) deleteGuest(row.id); }} className="act-link" style={{ color: "#b04040" }}>
                          {isAr ? "حذف" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                return [renderRow(g, false), ...companions.map((c) => renderRow(c, true))];
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {selGuest && (
        <div
          onClick={() => setSelGuest(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fi"
            style={{
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "40px 32px",
              maxWidth: 720,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 8px 40px rgba(0,0,0,.2)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div
                className={isAr ? "ar-b" : "cinzel"}
                style={{
                  fontSize: isAr ? 16 : 11,
                  color: C.mid,
                  marginBottom: 8,
                  letterSpacing: isAr ? 0 : ".2em",
                }}
              >
                {isAr ? "تعيين مقعد" : "SEAT ASSIGNMENT"}
              </div>
              <div
                className={isAr ? "ar-d" : "serif"}
                style={{ fontSize: isAr ? 28 : 32, color: C.dark, marginBottom: 6, direction: "rtl" }}
              >
                {selGuest.firstName} {selGuest.familyName}
              </div>
              <div
                style={{
                  fontSize: isAr ? 15 : 15,
                  color: C.muted,
                  fontFamily: isAr ? "Aref Ruqaa,Amiri,serif" : "Cormorant Garamond,serif",
                  fontStyle: isAr ? "normal" : "italic",
                  marginBottom: 16,
                }}
              >
                {t.admin.selectSeat}
              </div>
              <div className="gold-s"></div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
                gap: 12,
                marginBottom: 28,
              }}
            >
              {Array.from({ length: TOTAL_TABLES }).map((_, tIdx) => {
                const tn = tIdx + 1;
                const occ = getOcc(tn);
                return (
                  <div
                    key={tn}
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 4,
                      padding: "12px",
                      background: "#fafaf7",
                    }}
                  >
                    <div style={{ marginBottom: 8, textAlign: "center" }}>
                      {renamingTable === tn ? (
                        <div style={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "center" }}>
                          <input
                            autoFocus
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveTableName(tn, renameInput);
                              if (e.key === "Escape") setRenamingTable(null);
                            }}
                            style={{ width: 80, fontSize: 10, padding: "2px 4px", fontFamily: "Cinzel,serif", border: `1px solid ${C.border}`, borderRadius: 2 }}
                          />
                          <button onClick={() => saveTableName(tn, renameInput)} style={{ background: "none", border: "none", cursor: "pointer", color: C.gold, fontSize: 12, padding: "0 2px" }}>✓</button>
                          <button onClick={() => setRenamingTable(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, padding: "0 2px" }}>✕</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center" }}>
                          <span className={isAr ? "ar-b" : "cinzel"} style={{ fontSize: isAr ? 12 : 10, color: C.mid, letterSpacing: isAr ? 0 : ".15em" }}>
                            {tableNames[tn] || (isAr ? `طاولة ${tn}` : `TABLE ${String(tn).padStart(2, "0")}`)}
                          </span>
                          <button
                            onClick={() => { setRenamingTable(tn); setRenameInput(tableNames[tn] || ""); }}
                            title="Rename table"
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 10, padding: 0, lineHeight: 1, opacity: 0.6 }}
                          >✎</button>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5,1fr)",
                        gap: 3,
                      }}
                    >
                      {Array.from({ length: SEATS_PER_TABLE }).map(
                        (_, sIdx) => {
                          const sn = sIdx + 1;
                          const isOcc =
                            occ.includes(sn) &&
                            !(
                              selGuest.tableNumber === tn &&
                              selGuest.seatNumber === sn
                            );
                          const isMine =
                            selGuest.tableNumber === tn &&
                            selGuest.seatNumber === sn;
                          return (
                            <button
                              key={sn}
                              disabled={isOcc}
                              onClick={() => assignSeat(selGuest.id, tn, sn)}
                              style={{
                                padding: 5,
                                fontSize: 10,
                                background: isMine
                                  ? C.dark
                                  : isOcc
                                    ? "#f0ece0"
                                    : "#fff",
                                color: isMine
                                  ? "#fff"
                                  : isOcc
                                    ? "#ccc"
                                    : C.dark,
                                border: `1px solid ${isMine ? C.dark : C.border}`,
                                cursor: isOcc ? "not-allowed" : "pointer",
                                borderRadius: 2,
                                fontFamily: "Cinzel,serif",
                                transition: "all .2s",
                              }}
                            >
                              {String(sn).padStart(2, "0")}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setSelGuest(null)} className="btn-s">
                {t.admin.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewQR && (
        <div
          onClick={() => setViewQR(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fi"
            style={{
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "40px",
              maxWidth: 400,
              textAlign: "center",
              boxShadow: "0 8px 40px rgba(0,0,0,.2)",
            }}
          >
            <div
              className="cinzel"
              style={{
                fontSize: 11,
                color: C.mid,
                marginBottom: 10,
                letterSpacing: ".2em",
              }}
            >
              ENTRY PASS
            </div>
            <div
              className="serif"
              style={{ fontSize: 28, color: C.dark, marginBottom: 6 }}
            >
              {viewQR.firstName} {viewQR.familyName}
            </div>
            <div className="gold-s" style={{ marginBottom: 24 }}></div>
            <div
              style={{
                border: `1px solid ${C.border}`,
                display: "inline-block",
                padding: 16,
                background: "#fff",
                marginBottom: 16,
                borderRadius: 4,
              }}
            >
              <RealQRCode value={viewQR.id} size={200} />
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.muted,
                fontFamily: "monospace",
                marginBottom: 24,
              }}
            >
              REF · {viewQR.id}
            </div>
            <button
              onClick={() => setViewQR(null)}
              className="btn-s"
              style={{ width: "100%" }}
            >
              {t.admin.close}
            </button>
          </div>
        </div>
      )}

      {/* ── Send Invitations Panel ── */}
      <InvitePanel t={t} lang={lang} isAr={isAr} />
    </div>
  );
}

/* ──────────────────────────── INVITE PANEL ──────────────────────────── */
function InvitePanel({ t, lang, isAr }: any) {
  const [open, setOpen] = useState(false);
  const [phones, setPhones] = useState("");
  const [msgLang, setMsgLang] = useState(lang);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<{ phone: string; ok: boolean; error?: string }[]>([]);

  const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  const API = BASE.replace(/\/[^/]*$/, "") + "/api";

  const handleSend = async () => {
    const list = phones
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (list.length === 0) {
      alert(t.invite.noPhones);
      return;
    }
    setSending(true);
    setResults([]);
    try {
      const resp = await fetch(`${API}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phones: list, lang: msgLang }),
      });
      const data = await resp.json();
      setResults(data.results || []);
    } catch (err: any) {
      setResults(list.map((phone) => ({ phone, ok: false, error: "Network error" })));
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        marginTop: 48,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: C.cream,
          border: "none",
          padding: "18px 24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Send size={16} color={C.dark} strokeWidth={1.5} />
          <span
            style={{
              fontFamily: isAr ? "Aref Ruqaa,serif" : "Cinzel,serif",
              fontSize: isAr ? 15 : 11,
              letterSpacing: isAr ? 0 : ".18em",
              color: C.dark,
            }}
          >
            {t.invite.toggle}
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} color={C.mid} />
        ) : (
          <ChevronDown size={16} color={C.mid} />
        )}
      </button>

      {open && (
        <div style={{ padding: "28px 28px 32px", background: "#fff" }}>
          <div
            className="cinzel fi1"
            style={{ fontSize: 11, color: C.mid, marginBottom: 8, letterSpacing: ".22em" }}
          >
            {t.invite.chapter}
          </div>
          <div
            className={`fi2 ${isAr ? "ar-d" : "serif"}`}
            style={{ fontSize: isAr ? 32 : 38, color: C.dark, marginBottom: 6, lineHeight: 1.1 }}
          >
            {t.invite.title}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.muted,
              fontFamily: isAr ? "Aref Ruqaa,serif" : "Cormorant Garamond,serif",
              fontStyle: isAr ? "normal" : "italic",
              marginBottom: 24,
            }}
          >
            {t.invite.subtitle}
          </div>

          <div className="gold-s" style={{ marginBottom: 28 }}></div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Phone textarea */}
            <div className="field-wrap">
              <label className={isAr ? "field-label-ar" : "field-label"}>
                {isAr ? (
                  <span className="ar-b">أرقام الهواتف</span>
                ) : (
                  "Phone Numbers"
                )}
              </label>
              <textarea
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
                className={`input-box${isAr ? " ar-b" : ""}`}
                placeholder={t.invite.placeholder}
                rows={6}
                style={{ resize: "vertical", fontFamily: "monospace", fontSize: 14 }}
              />
            </div>

            {/* Language selector */}
            <div className="field-wrap">
              <label className={isAr ? "field-label-ar" : "field-label"}>
                {isAr ? <span className="ar-b">{t.invite.lang}</span> : t.invite.lang}
              </label>
              <select
                value={msgLang}
                onChange={(e) => setMsgLang(e.target.value)}
                className={`input-box${isAr ? " ar-b" : ""}`}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={sending}
              className="btn-p"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <Send size={14} />
              {isAr ? (
                <span className="btn-p-ar">
                  {sending ? t.invite.sending : t.invite.send}
                </span>
              ) : sending ? (
                t.invite.sending
              ) : (
                t.invite.send
              )}
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div
                  className="cinzel"
                  style={{ fontSize: 11, color: C.mid, marginBottom: 12, letterSpacing: ".18em" }}
                >
                  {t.invite.results}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {results.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        background: r.ok ? "rgba(122,154,106,.08)" : "rgba(185,28,28,.05)",
                        border: `1px solid ${r.ok ? "rgba(122,154,106,.2)" : "rgba(185,28,28,.15)"}`,
                        borderRadius: 4,
                      }}
                    >
                      {r.ok ? (
                        <CheckCircle2 size={15} color={C.light} strokeWidth={1.5} />
                      ) : (
                        <XCircle size={15} color="#b91c1c" strokeWidth={1.5} />
                      )}
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 13,
                          color: C.dark,
                          flex: 1,
                        }}
                      >
                        {r.phone}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: r.ok ? C.light : "#b91c1c",
                          fontFamily: "Cormorant Garamond,serif",
                          fontStyle: "italic",
                        }}
                      >
                        {r.ok ? t.invite.sent : r.error || t.invite.failed}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── SCANNER ──────────────────────────── */
function ScannerView({ t, lang, guests, updateGuest, refreshGuests, authRole, setAuthRole }: any) {
  if (authRole === "none")
    return (
      <LoginGate
        t={t}
        lang={lang}
        allowViewer={true}
        onSuccess={(role: string) => setAuthRole(role)}
      />
    );
  return <ScannerContent t={t} lang={lang} guests={guests} updateGuest={updateGuest} refreshGuests={refreshGuests} authRole={authRole} setAuthRole={setAuthRole} />;
}

function ScannerContent({ t, lang, guests, updateGuest, refreshGuests, authRole, setAuthRole }: any) {
  const [scannedGuest, setScannedGuest] = useState<any>(null);
  const [manualId, setManualId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const qrRef = useRef<any>(null);
  const guestsRef = useRef(guests);
  const isAr = lang === "ar";
  useEffect(() => {
    guestsRef.current = guests;
  }, [guests]);

  const processScan = async (txt: string) => {
    let gid = txt.trim();
    if (gid.includes("/"))
      gid = gid.split("/").pop()!.split("?")[0].split("#")[0];
    const g = guestsRef.current.find((x: Guest) => x.id === gid);
    if (!g) {
      setScannedGuest({
        error: `${t.scanner.notFound}: "${gid.substring(0, 30)}"`,
      });
      return;
    }
    const already = g.checkedInAt !== null;
    setScannedGuest({ ...g, alreadyChecked: already });
    if (!already) {
      updateGuest(g.id, { checkedInAt: new Date().toISOString() });
      try {
        await fetch(`/api/guests/${g.id}/checkin`, { method: "POST" });
        await refreshGuests();
      } catch {
        /* keep optimistic update */
      }
    }
  };

  const stopCamera = async () => {
    if (qrRef.current) {
      try {
        await qrRef.current.stop();
        qrRef.current.clear();
      } catch {}
      qrRef.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setScannedGuest(null);
    try {
      if (!(window as any).Html5Qrcode) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement("script");
          s.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js";
          s.onload = () => res();
          s.onerror = () => rej(new Error("fail"));
          document.head.appendChild(s);
        });
      }
      setIsScanning(true);
      await new Promise((r) => setTimeout(r, 150));
      const elem = document.getElementById("qr-reader");
      if (!elem) {
        setIsScanning(false);
        setCameraError("Scanner not ready.");
        return;
      }
      const scanner = new (window as any).Html5Qrcode("qr-reader");
      qrRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded: string) => {
          processScan(decoded);
          stopCamera();
        },
        () => {},
      );
    } catch (err: any) {
      setIsScanning(false);
      setCameraError(err?.message || String(err));
    }
  };

  useEffect(
    () => () => {
      stopCamera();
    },
    [],
  );

  return (
    <div className="fi">
      <div style={{ textAlign: "center", marginBottom: 48, position: "relative" }}>
        {setAuthRole && (
          <button
            onClick={() => setAuthRole("none")}
            className="btn-s"
            style={{ position: "absolute", [isAr ? "left" : "right"]: 0, top: 0, fontSize: 11, padding: "8px 16px" }}
          >
            {isAr ? <span className="ar-b">خروج</span> : "Sign Out"}
          </button>
        )}
        <div
          className="cinzel fi1"
          style={{
            fontSize: 11,
            color: C.mid,
            marginBottom: 10,
            letterSpacing: ".22em",
          }}
        >
          {t.scanner.chapter}
        </div>
        <div
          className={`fi2 ${isAr ? "ar-d" : "serif"}`}
          style={{
            fontSize: isAr ? 44 : 50,
            color: C.dark,
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          {t.scanner.title}
        </div>
        <div className="gold-s fi3"></div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
          gap: 28,
        }}
      >
        <div
          className="fi3 card"
          style={{ borderColor: C.border, borderRadius: 6 }}
        >
          <div
            style={{
              fontSize: isAr ? 14 : 11,
              color: C.mid,
              marginBottom: 18,
              fontFamily: isAr ? "Aref Ruqaa,serif" : "Cinzel,serif",
              letterSpacing: isAr ? 0 : ".18em",
            }}
          >
            {t.scanner.cameraLabel}
          </div>
          {!isScanning ? (
            <div
              style={{
                background: C.dark,
                padding: 40,
                textAlign: "center",
                marginBottom: 20,
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 4,
              }}
            >
              <Camera
                size={40}
                color={C.gold}
                strokeWidth={1}
                style={{ margin: "0 auto 14px" }}
              />
              <div
                className="cinzel"
                style={{
                  color: C.gold,
                  fontSize: 11,
                  marginBottom: 18,
                  letterSpacing: ".18em",
                }}
              >
                {t.scanner.cameraOff}
              </div>
              <button
                onClick={startCamera}
                className="btn-p"
                style={{
                  background: C.gold,
                  color: C.dark,
                  margin: "0 auto",
                  padding: "14px 28px",
                  fontSize: 13,
                }}
              >
                {isAr ? (
                  <span className="btn-p-ar">{t.scanner.startCamera}</span>
                ) : (
                  t.scanner.startCamera
                )}
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 20 }}>
              <div
                id="qr-reader"
                style={{
                  width: "100%",
                  minHeight: 260,
                  background: "#000",
                  overflow: "hidden",
                  borderRadius: 4,
                }}
              ></div>
              <button
                onClick={stopCamera}
                className="btn-s"
                style={{ width: "100%", marginTop: 12 }}
              >
                {t.scanner.stopCamera}
              </button>
            </div>
          )}
          {cameraError && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fff5f5",
                border: "1px solid #fcc",
                borderRadius: 4,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  color: "#b91c1c",
                  fontFamily: "Cormorant Garamond,serif",
                  fontStyle: "italic",
                }}
              >
                {cameraError}
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 28,
              paddingTop: 28,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontSize: isAr ? 14 : 11,
                color: C.mid,
                marginBottom: 14,
                fontFamily: isAr ? "Aref Ruqaa,serif" : "Cinzel,serif",
                letterSpacing: isAr ? 0 : ".18em",
              }}
            >
              {t.scanner.manualLabel}
            </div>
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder={t.scanner.manualPlaceholder}
              className={`input-box${isAr ? " ar-b" : ""}`}
              style={{ marginBottom: 14, fontSize: 17 }}
            />
            <button
              onClick={() => {
                if (manualId.trim()) {
                  processScan(manualId);
                  setManualId("");
                }
              }}
              className="btn-s"
              style={{ width: "100%", fontSize: 12 }}
            >
              {isAr ? (
                <span className="btn-p-ar" style={{ color: "inherit" }}>
                  {t.scanner.checkByID}
                </span>
              ) : (
                t.scanner.checkByID
              )}
            </button>
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 28,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontSize: isAr ? 14 : 11,
                color: C.mid,
                marginBottom: 14,
                fontFamily: isAr ? "Aref Ruqaa,Amiri,serif" : "Cinzel,serif",
                letterSpacing: isAr ? 0 : ".18em",
              }}
            >
              {t.scanner.quickTest}
            </div>
            <input
              type="text"
              value={manualId.startsWith("ql:") ? manualId.slice(3) : ""}
              onChange={(e) => setManualId(e.target.value ? `ql:${e.target.value}` : "")}
              placeholder={isAr ? "ابحث عن ضيف…" : "Search guest name…"}
              className={`input-box${isAr ? " ar-b" : ""}`}
              style={{ marginBottom: 10, fontSize: 16 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                background: C.border,
                borderRadius: 4,
                overflow: "hidden",
                maxHeight: 220,
                overflowY: "auto",
              }}
            >
              {guests
                .filter((g: Guest) => {
                  const q = (manualId.startsWith("ql:") ? manualId.slice(3) : "").toLowerCase().trim();
                  if (!q) return true;
                  const nameMatch = `${g.firstName} ${g.familyName}`.toLowerCase().includes(q);
                  const phoneMatch = g.fullPhone.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
                  return nameMatch || phoneMatch;
                })
                .slice(0, 20)
                .map((g: Guest) => (
                  <button
                    key={g.id}
                    onClick={() => { processScan(g.id); setManualId(""); }}
                    style={{
                      textAlign: isAr ? "right" : "left",
                      background: g.checkedInAt ? "#f0f7ec" : "#fafaf7",
                      border: "none",
                      padding: "10px 16px",
                      cursor: "pointer",
                      transition: "background .2s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{
                        fontFamily: isAr ? "Aref Ruqaa,Amiri,serif" : "Cormorant Garamond,serif",
                        fontSize: isAr ? 16 : 18,
                        color: C.dark,
                        lineHeight: 1.2,
                      }}>{g.firstName} {g.familyName}</span>
                      {!g.fullPhone.startsWith("companion-") && (
                        <span style={{
                          fontSize: 11,
                          color: C.muted,
                          fontFamily: "monospace",
                          letterSpacing: ".04em",
                        }} dir="ltr">{g.fullPhone}</span>
                      )}
                    </div>
                    {g.checkedInAt && <CheckCircle2 size={14} color={C.light} />}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="fi4">
          {scannedGuest ? (
            <div
              className="fi card"
              style={{
                borderRadius: 6,
                borderColor: scannedGuest.error
                  ? "#fcc"
                  : scannedGuest.alreadyChecked
                    ? C.gold
                    : C.light,
                borderWidth: 2,
              }}
            >
              {scannedGuest.error ? (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <XCircle
                    size={48}
                    color="#b91c1c"
                    strokeWidth={1}
                    style={{ margin: "0 auto 12px" }}
                  />
                  <div
                    className="serif"
                    style={{ fontSize: 20, color: "#b91c1c" }}
                  >
                    {scannedGuest.error}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    {scannedGuest.alreadyChecked ? (
                      <>
                        <AlertCircle
                          size={44}
                          color={C.gold}
                          strokeWidth={1}
                          style={{ margin: "0 auto 10px" }}
                        />
                        <div
                          className="cinzel"
                          style={{
                            fontSize: 12,
                            color: C.gold,
                            letterSpacing: ".25em",
                          }}
                        >
                          {t.scanner.alreadyIn}
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={44}
                          color={C.light}
                          strokeWidth={1}
                          style={{ margin: "0 auto 10px" }}
                        />
                        <div
                          className="cinzel"
                          style={{
                            fontSize: 12,
                            color: C.light,
                            letterSpacing: ".3em",
                          }}
                        >
                          {t.scanner.welcome}
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    className="script"
                    style={{
                      fontSize: 64,
                      color: C.dark,
                      textAlign: "center",
                      lineHeight: 0.9,
                      marginBottom: 6,
                    }}
                  >
                    {scannedGuest.firstName}
                  </div>
                  <div
                    className="ital"
                    style={{
                      fontSize: 22,
                      color: C.muted,
                      textAlign: "center",
                      marginBottom: 28,
                    }}
                  >
                    {scannedGuest.familyName}
                  </div>
                  <div className="gold-s" style={{ marginBottom: 24 }}></div>
                  {[
                    [t.scanner.phone, scannedGuest.fullPhone],
                    [t.scanner.group, scannedGuest.group],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "14px 0",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: C.mid,
                          fontFamily: "Cinzel,serif",
                          letterSpacing: ".12em",
                        }}
                      >
                        {k}
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          color: C.dark,
                          fontFamily: "Cormorant Garamond,serif",
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                  {scannedGuest.tableNumber ? (
                    <div
                      style={{
                        background: C.dark,
                        padding: 28,
                        textAlign: "center",
                        marginTop: 20,
                        borderRadius: 4,
                      }}
                    >
                      <div
                        className="cinzel"
                        style={{
                          fontSize: 10,
                          color: C.gold,
                          marginBottom: 16,
                          letterSpacing: ".25em",
                        }}
                      >
                        {t.scanner.proceed}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 20,
                        }}
                      >
                        {[
                          [t.scanner.table, scannedGuest.tableNumber],
                          [t.scanner.seat, scannedGuest.seatNumber],
                        ].map(([l, v]: any) => (
                          <div key={l}>
                            <div
                              className="cinzel"
                              style={{
                                fontSize: 9,
                                color: "#888",
                                marginBottom: 4,
                                letterSpacing: ".15em",
                              }}
                            >
                              {String(l).toUpperCase()}
                            </div>
                            <div
                              className="serif"
                              style={{
                                fontSize: 52,
                                color: "#fff",
                                lineHeight: 1,
                              }}
                            >
                              {String(v).padStart(2, "0")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#fafaf7",
                        padding: 18,
                        textAlign: "center",
                        marginTop: 20,
                        border: `1px solid ${C.border}`,
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          color: C.muted,
                          fontFamily: "Cormorant Garamond,serif",
                          fontStyle: "italic",
                        }}
                      >
                        {t.scanner.noSeat}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: 60,
                borderColor: C.border,
                borderRadius: 6,
              }}
            >
              <div
                className="script"
                style={{ fontSize: 60, color: C.gold, marginBottom: 12 }}
              >
                Welcome
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: C.muted,
                  fontFamily: "Cormorant Garamond,serif",
                  fontStyle: "italic",
                }}
              >
                {isAr ? "بانتظار الضيف…" : "Awaiting next guest…"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
