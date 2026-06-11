/* ============================================================
   SpacECE India Foundation — Teacher Training Portal
   app.js
   ============================================================ */

'use strict';

/* ============================================================
   DATA
   ============================================================ */

const ASSETS = {
  logo: "https://z-cdn-media.chatglm.cn/files/5a8b995d-e716-4f0c-861b-a81ff61b455c.jpg?auth_key=1878924481-7f2f398c641441d19bef31ee297b3007-0-f73b00a81905f5c76f4395241ea040a4",
  hero: "https://z-cdn-media.chatglm.cn/files/b190f12d-f51a-43ea-bf60-8453ddad9dcd.png?auth_key=1878924481-08bbe6caf19046a2ab6739ec4c762a42-0-39945966a0f06fa25c267b38a6328789",
  aboutMain: "https://z-cdn-media.chatglm.cn/files/987d1932-0a20-4ecc-a69e-0912e70c851a.png?auth_key=1878924481-b793000ab2864e32a3edaad1137068b4-0-b4e751ed20ded6323c925171c997a0c2",
  aboutSmall: "https://z-cdn-media.chatglm.cn/files/ecba47e9-6004-4d37-9b71-4cf728d34ad0.png?auth_key=1878924481-6932a04fd8b8416ca36b6fd9ef270dea-0-475b0d644c6a5c51ff4dc5e577ff24bd",
  googleForm: "https://docs.google.com/forms/d/e/1FAIpQLSf1qJKod-3F5Wl7HJoRdtMVOK-F3QjKGYQEAtKXZUH0u1g2nA/viewform?usp=publish-editor"
};

const CURRICULUM_DATA = {
  gujarati: {
    level1: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1Y_8ton4fe_ZNWutoDbJRjDeKVe0Kb7eF/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1FVljj5Nanl7AIjATxD484NRPjfbVqMb6/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1tn6uwgHz7XrSTHv7D0mxZkOt-yr95e6E/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1_0YYmTYcupC3Xe0C9L0vPcNEr_osm8ak/view?usp=sharing", icon: "fa-star" }
    ],
    level2: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1gV0zmlUPfiWqxIY0pWqAp3ZVx6OQtucB/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1at88ORikedu1aCAmn4snwIFLLrvishN4/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/11px2meYdwiSjU5T6QnCHyzRIiMi0VipQ/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1xK-_4Taf4V2h7ppIHwAePIqRVi-SdADS/view?usp=sharing", icon: "fa-star" }
    ],
    level3: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1gtn_KME92RbKbQ6FzkRQaH6QjcKxN7NI/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1TMg9rM0_YJ1k53e3tmu2EcVhzHyvz8Dm/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1rLyzj_svyvZYj0rSv02ORbg-Pm68Zg3N/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1D4GUpNfHUJpMEv0JiNfgcEoGt17MrYXC/view?usp=sharing", icon: "fa-star" }
    ],
    level4: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1-b9B3hkEHFHIEveDFD4Vh0YpuZUJR2Vq/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1HJG8UdXgfRUR2m_tQu6oydnSWBRPGv66/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1fgbJVybFn2gOYVl9OUhNJC0pkJV-eoLL/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1IGDb0B4Bsb30QFcDCiOCvLB97hE8XyaG/view?usp=sharing", icon: "fa-star" }
    ],
    essentials: [
      { title: "Field Work Tracker (1–3 Months)", link: "https://drive.google.com/file/d/1nI7zlyJLIqr8bbfEh6aR-S3yPXUFCIrm/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Field Work Tracker (4–6 Months)", link: "https://drive.google.com/file/d/1RE592puGXtU_S5mXIOXq4Gj1YcNv_jZ1/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Teacher Training Handbook", link: "https://drive.google.com/file/d/1XyUYtyQmdg2aDSOXYp52nc1IganU_Dof/view?usp=sharing", icon: "fa-book-reader" },
      { title: "Lesson Plan", link: "https://drive.google.com/file/d/1wO3XVsAF3jrIQE5zcUviF0gaPvviprHC/view?usp=sharing", icon: "fa-chalkboard-teacher" }
    ]
  },
  marathi: {
    level1: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1laLgq0Ni3gVVavNSBkBsgXcPOYYrA-Uv/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1Yhwb9INM-G_HJMpX4jXlezK0EEYimT9L/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1ygy_asBogHL6-ww2BhJ90blib0b5eFt2/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1tcairrn9xnH9PEVKoizfDEybAYsSpxCs/view?usp=sharing", icon: "fa-star" }
    ],
    level2: [
      { title: "Part 1", link: "https://drive.google.com/file/d/128H9HAnhvTe42pBpyz_MQKjJmeag1iWe/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1GQWBIEnpOXfMoaven-N0btToGiiaueiw/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1rvLcESauBMqOGO8e4stM6XdoIU5D2HDE/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1hQNrVxBYYVFr7yu4Gs71Lm2YMJPUxInS/view?usp=sharing", icon: "fa-star" }
    ],
    level3: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1395_NCDE1HCdN1edMUnItLobTJYcqP0K/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1beCf4TFXsiQegQ_kU5CHuvcyQPA3BLSG/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1gCUgRuZfFDmAi0HbXHPr4zLu9ncYFLpQ/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1SQET1DnCdJehdDnVWkC3Ipl4wYIzaEhT/view?usp=sharing", icon: "fa-star" }
    ],
    level4: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1enCxPoanEjDvrq1LzZpN8LQLyrJ39l3e/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/12POXxADeZ7BFEOoUegHKuOV-lTBDhEyw/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1RJG03aFgzFrzeF3JWZdRyd273XK6LWn6/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/18WJmrsvaFBReDBBxp7m4utnb6DxJeeIy/view?usp=sharing", icon: "fa-star" }
    ],
    essentials: [
      { title: "Field Work Tracker (1–3 Months)", link: "https://drive.google.com/file/d/18WJmrsvaFBReDBBxp7m4utnb6DxJeeIy/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Field Work Tracker (4–6 Months)", link: "https://drive.google.com/file/d/1B1-KQzh-gScMfBRpj0-_2eC_iMl0qA20/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Teacher Training Handbook", link: "https://drive.google.com/file/d/1J2rkRSINO8zSwBVJRyZfcg1SLvMLumnq/view?usp=sharing", icon: "fa-book-reader" },
      { title: "Lesson Plan", link: "https://drive.google.com/file/d/1PmnpsP4_lldIFNIx4VnOk_nzn9RkpKx4/view?usp=sharing", icon: "fa-chalkboard-teacher" }
    ]
  },
  hindi: {
    level1: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1w-Yndt8bvH0SOEdjAQWj3u3MhD-8XBOb/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1QchEepQninuHaR8P21q7fiWg-MQQVn32/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/12OsQGQ8TsPQtdmku6FwWwiBhnSex_d8G/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1TMYOyIl9XEUHVmKyEc86N3QviF0r-NLk/view?usp=sharing", icon: "fa-star" }
    ],
    level2: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1qtEeWD7TmJmewV0QCZ3OFrunEFWB6Ct3/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/192UmNg10b-zkxCxToGv4eZoZkmi3EC81/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1Z9P9UftS1e71iEnpA0Yfc32dxkHgRAn1/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1NsZHAEfl16LdL3W7UURh0M0kN21oq_DP/view?usp=sharing", icon: "fa-star" }
    ],
    level3: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1F1k8Gei0n6wR9IRMXCutdOXEeZRiXVr_/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1-LWzWkLwYDX-4SoGEtwGixinKNC5yZBh/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1-Tp0PWRny26jXMoqpkFJcIwtbrkyU0OK/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/12zvV0dMleOpYfxkn4qxFcrQXWdKbz5M2/view?usp=sharing", icon: "fa-star" }
    ],
    level4: [
      { title: "Part 1", link: "https://drive.google.com/file/d/10efCc3M-P6G7Q7rrgJR2Ahk-dXLE1Wnf/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1Xb186sjHM1fc1r5QS7FLdeXoSm2k8b_Q/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1pNdGrbHb1z2MNd7DlWb7q6Oe6gcw9k-Y/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1tM5M_naOmK03Bfgjta8Klj0uqFbXULam/view?usp=sharing", icon: "fa-star" }
    ],
    essentials: [
      { title: "Field Work Tracker (1–3 Months)", link: "https://drive.google.com/file/d/1YUoOJ1oA1eOOsOq1Z18YAUmRK3wSBd6h/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Field Work Tracker (4–6 Months)", link: "https://drive.google.com/file/d/1XBwfjRRQtacWMNEI9acxlqKipLolaJjs/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Teacher Training Handbook", link: "https://drive.google.com/file/d/1KDWUTTFO9Wcju_zcYRZIEMf9TACpccXy/view?usp=sharing", icon: "fa-book-reader" },
      { title: "Lesson Plan", link: "https://drive.google.com/file/d/1i52LsrAs4Ao8y29ffaEw1CDWVfnG8aTj/view?usp=sharing", icon: "fa-chalkboard-teacher" }
    ]
  },
  english: {
    level1: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1PZioY1A1iWN6GfSAZ7Ux1Afs2p4oCffb/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1A8jwZzm4grnp9drRBdiCaC6goCAx9opt/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1NaoBTstUAjMp4Z-rjtJf9uezE7uZpNEV/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1xt7d1MnEFcyiSZHSqjcGuwqBp1amfSTq/view?usp=sharing", icon: "fa-star" }
    ],
    level2: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1ZftGOb-fyzd6_tWCj_f_JGWKbIhs61q4/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1x4Zz988dRUxvK3orL18-jfbzv5gt5quz/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1edM03SDC8YkQ0oQJW6HDBcI9wselAjMV/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1NXE4fhPrOqvTV1ZbjFUI4zGSZji3eXec/view?usp=sharing", icon: "fa-star" }
    ],
    level3: [
      { title: "Part 1", link: "https://drive.google.com/file/d/17UhjipmQonLJP8KPsZ0Hs5ulcIG6Ta65/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1agiMpBO8XOfnyU3aVXLQI0vRv1a4Zjuk/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1Fyy6dlerTwam5OLixFOUtaqx12WF5OET/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1uaoq2HwisKkrNVMccToYd2GUbytygwYH/view?usp=sharing", icon: "fa-star" }
    ],
    level4: [
      { title: "Part 1", link: "https://drive.google.com/file/d/1J2qPUP2dJeIqcMqAiiTVktJzOFNNOKMb/view?usp=sharing", icon: "fa-book" },
      { title: "Part 2", link: "https://drive.google.com/file/d/1ZjneO_9tXHpI0bmlQPKDh9OApjLFwf0G/view?usp=sharing", icon: "fa-book" },
      { title: "Alphabets & Numbers", link: "https://drive.google.com/file/d/1Isj_27HOlbqwyCYNR8gsXFKWkZLuAfOa/view?usp=sharing", icon: "fa-font" },
      { title: "Single Day Celebration", link: "https://drive.google.com/file/d/1Urne9JU0S6VGFyCQRF5uKpBeBKIMe85U/view?usp=sharing", icon: "fa-star" }
    ],
    essentials: [
      { title: "Field Work Tracker (1–3 Months)", link: "https://drive.google.com/file/d/1m3XyrEOY_5Q_BxVRMtC4TzLVu2TCuw3Z/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Field Work Tracker (4–6 Months)", link: "https://drive.google.com/file/d/1rZm9HsHRRzVfgEsL4iQJkBBWwUNKBRwh/view?usp=sharing", icon: "fa-clipboard-check" },
      { title: "Teacher Training Handbook", link: "https://drive.google.com/file/d/1-ykxT8VUXtS9udvQ607AB6PvtJj047LM/view?usp=drive_link", icon: "fa-book-reader" },
      { title: "Lesson Plan", link: "https://drive.google.com/file/d/1oWGnvVaASOxnUr9i_t3j8BUojN-L__2m/view?usp=drive_link", icon: "fa-chalkboard-teacher" }
    ]
  }
};

/* ============================================================
   LANGUAGE STATION DATA
   ============================================================ */
const LANGSTATION_PDFS = [
  {
    title: "Arts in Early Childhood",
    filename: "arts-in-early-childhood-dec2015-rev",
    path: "landing-pages/Teacher-Training-Program/pdf/arts-in-early-childhood-dec2015-rev",
    icon: "fa-palette",
    desc: "A foundational resource on integrating arts into early childhood education.",
    link: "#"
  },
  {
    title: "d05dd1cf-en",
    filename: "d05dd1cf-en",
    path: "landing-pages/Teacher-Training-Program/pdf/d05dd1cf-en",
    icon: "fa-file-pdf",
    desc: "Reference document for teacher training programme use.",
    link: "#"
  },
  {
    title: "KG Grade 1 Sentences",
    filename: "KG Grade1 Sentences_260526_053556",
    path: "landing-pages/Teacher-Training-Program/pdf/KG Grade1 Sentences_260526_053556",
    icon: "fa-spell-check",
    desc: "Sentences practice sheets for KG and Grade 1 language station activities.",
    link: "#"
  },
  {
    title: "Onboarding Welcome Packet",
    filename: "Onboarding Welcome Packet",
    path: "landing-pages/Teacher-Training-Program/pdf/Onboarding Welcome Packet",
    icon: "fa-handshake",
    desc: "Welcome packet for new SpacECE teaching staff and trainees.",
    link: "#"
  },
  {
    title: "Seeds of Success",
    filename: "Seeds of Success",
    path: "landing-pages/Teacher-Training-Program/pdf/Seeds of Success",
    icon: "fa-seedling",
    desc: "A guide to early success strategies for young learners.",
    link: "#"
  },
  {
    title: "Sensory",
    filename: "Sensary",
    path: "landing-pages/Teacher-Training-Program/pdf/Sensary",
    icon: "fa-hand-paper",
    desc: "Sensory play and learning activities for early childhood classrooms.",
    link: "#"
  },
  {
    title: "SpacECE – Essential Topics for Teaching Staff",
    filename: "SpacECE - Essential Topics for Teaching Staff",
    path: "landing-pages/Teacher-Training-Program/pdf/SpacECE - Essential Topics for Teaching Staff",
    icon: "fa-chalkboard-teacher",
    desc: "Key topics every SpacECE teaching staff member should know.",
    link: "#"
  },
  {
    title: "Station-based Design for Preschools",
    filename: "Station-based Design for Preschools",
    path: "landing-pages/Teacher-Training-Program/pdf/Station-based Design for Preschools",
    icon: "fa-map-marked-alt",
    desc: "How to design and set up learning stations in a preschool classroom.",
    link: "#"
  }
];

const LANGSTATION_PLAYLISTS = [
  {
    title: "SpacECE Playlist 1",
    link: "https://www.youtube.com/playlist?list=PLV3Y-5-ti6T2fqt0n0h9nspL1hnC77J4c",
    icon: "fa-play-circle",
    desc: "Curated video playlist shared by the SpacECE team for language and classroom practice."
  },
  {
    title: "SpacECE Playlist 2",
    link: "https://www.youtube.com/playlist?list=PLV3Y-5-ti6T0g4LdcP0mKB_lhGi33mCt2",
    icon: "fa-play-circle",
    desc: "Second YouTube playlist with additional teacher training and activity videos."
  },
  {
    title: "SpacECE Playlist 3",
    link: "https://www.youtube.com/playlist?list=PLV3Y-5-ti6T3MtQqKPp-RjUGbZC-Zg-0o",
    icon: "fa-play-circle",
    desc: "Third playlist featuring extended content for classroom and language station use."
  }
];

const LANGSTATION_PERFORMANCES = [
  {
    title: "Tanaya at Udaan Centre – SpacECE",
    link: "#",
    icon: "fa-music",
    desc: "Tanaya performing at the Udaan Centre, SpacECE — a celebration of student talent and expression."
  },
  {
    title: "Rain Theme Activity",
    link: "#",
    icon: "fa-cloud-rain",
    desc: "A rain-themed classroom activity and performance. Great inspiration for seasonal language station setups."
  }
];

const EXTRA_RESOURCES = [
  { title: "Activity Booklet", link: "https://drive.google.com/drive/folders/1YQcZ0odEUnQn9iphRRMss_cjHEJkgqOW?usp=drive_link", icon: "fa-cut", desc: "Hands-on printable activity booklets for classroom use." },
  { title: "Kids Worksheet", link: "https://drive.google.com/drive/folders/13Z6xay62qXBFgJpDUgxDiMVNRAMp11ke?usp=drive_link", icon: "fa-pencil-alt", desc: "Age-appropriate worksheets for preschool children." },
  { title: "Parents Capacity Building", link: "https://drive.google.com/file/d/1C6Kh7dB5_OfdDA0DPx3GydCPZXb-SSm6/view?usp=drive_link", icon: "fa-users", desc: "Materials for parent workshops and family engagement." },
  { title: "Nursery Booklets", link: "https://drive.google.com/drive/folders/1MHnIiGab301a02uh-kUnx7wdmtG6he7K?usp=drive_link", icon: "fa-child", desc: "Nursery-level learning booklets for young learners." },
  { title: "Station Worksheets", link: "https://www.facebook.com/share/r/1CuE3GA3yX/", icon: "fa-clipboard-list", desc: "In-class and take-home worksheets for each learning station. One per station per week." },
  { title: "20 Habits Before Age 2", link: "https://drive.google.com/YOUR_PDF_LINK_HERE", icon: "fa-baby", desc: "Marathi/English parent guide based on CDC & WHO 24-month milestones. Use at PTMs and parent meetings." }
];

/* Station Activity Bank — FB links from Sachin Sir */
const STATION_ACTIVITIES = [
  {
    title: "Art Station",
    icon: "fa-palette",
    color: "#FFF0F3",
    iconColor: "#E11D48",
    links: [
      { label: "Art Station Example 1", url: "https://www.facebook.com/share/r/1No37r1ZjS/" },
      { label: "Art Station Setup", url: "https://www.facebook.com/share/r/1KRc6PB9UJ/" },
      { label: "Art Corner Video", url: "https://www.facebook.com/share/v/14cn5V7E7SK/" },
      { label: "Art Corner Ref", url: "https://www.facebook.com/share/r/1CqTfkLair/" },
      { label: "Fine Motor Skills", url: "https://www.facebook.com/share/r/1GQggwcBh7/" }
    ]
  },
  {
    title: "Sports Station",
    icon: "fa-futbol",
    color: "#ECFDF5",
    iconColor: "#059669",
    links: [
      { label: "Sports Station Fun", url: "https://www.facebook.com/share/r/1BLQAEWY6x/" },
      { label: "Sports Activity Ref", url: "https://www.facebook.com/share/r/1BVAb8KSfY/" },
      { label: "Sports is Fun", url: "https://www.facebook.com/share/r/1Cbi9sCHPP/" },
      { label: "Sports Station 2", url: "https://www.facebook.com/share/r/18d9vu84s3/" },
      { label: "Gross Motor Dev.", url: "https://www.facebook.com/share/r/1HQTXmp3VP/" }
    ]
  },
  {
    title: "Music Station",
    icon: "fa-music",
    color: "#FFF8E0",
    iconColor: "#D97706",
    links: [
      { label: "Bits and Rhythm", url: "https://www.facebook.com/share/r/17VM1LdcM5/" },
      { label: "Introducing Beats", url: "https://www.facebook.com/share/r/17ZUaLpryv/" },
      { label: "Different Instruments", url: "https://www.facebook.com/share/r/1H2TqJKoGB/" },
      { label: "Music Activity Ref", url: "https://www.facebook.com/share/r/1DVoEgsoVG/" }
    ]
  },
  {
    title: "Performing Arts Station",
    icon: "fa-theater-masks",
    color: "#EFF6FF",
    iconColor: "#2563EB",
    links: [
      { label: "Performing Arts Ref", url: "https://www.facebook.com/share/r/1BD8TxCjgq/" },
      { label: "Dance for Toddlers", url: "https://www.facebook.com/share/r/18rXQiiAWR/" },
      { label: "Dance and Fun (Video)", url: "https://www.facebook.com/share/v/1L4ARYZtCx/" },
      { label: "Dance Activities", url: "https://www.facebook.com/share/r/1C8vKSsamC/" },
      { label: "Introduce Dance 1", url: "https://www.facebook.com/share/r/19TmDB4SMb/" },
      { label: "Introduce Dance 2", url: "https://www.facebook.com/share/r/1CrVvFzQah/" },
      { label: "Introduce Dance 3", url: "https://www.facebook.com/share/r/1J7XNmB5x6/" },
      { label: "Dance Video", url: "https://www.facebook.com/share/v/1BC7BYijoe/" }
    ]
  },
  {
    title: "Logic & Numeracy Station",
    icon: "fa-calculator",
    color: "#FFF4EC",
    iconColor: "#F56A00",
    links: [
      { label: "Grouping & Colour ID", url: "https://www.facebook.com/share/r/1EKazFUv1H/" },
      { label: "Numeracy Activity", url: "https://www.facebook.com/share/r/1GCeTc84R9/" },
      { label: "Collaborative Work", url: "https://www.facebook.com/share/r/1CcDavg92o/" }
    ]
  },
  {
    title: "Nature Station",
    icon: "fa-leaf",
    color: "#ECFDF5",
    iconColor: "#059669",
    links: [
      { label: "Nature Walk", url: "https://www.facebook.com/share/r/1BiQaj9mjJ/" },
      { label: "TLM Preparation", url: "https://www.facebook.com/share/r/18jmS1SSsh/" },
      { label: "Engaging with Nature 1", url: "https://www.facebook.com/share/r/1CjcBgztCy/" },
      { label: "Engaging with Nature 2", url: "https://www.facebook.com/share/r/1RJGSTJWGS/" },
      { label: "TLM Ideas", url: "https://www.facebook.com/share/r/1BELuJh8xN/" }
    ]
  },
  {
    title: "Literacy Station",
    icon: "fa-book-open",
    color: "#EFF6FF",
    iconColor: "#2563EB",
    links: [
      { label: "Reading Time Setup", url: "https://www.facebook.com/share/r/1DrffZRLop/" },
      { label: "Rhymes Ref", url: "https://www.facebook.com/share/r/1LFdJAbfhG/" },
      { label: "Innovative Rhymes", url: "https://www.facebook.com/share/r/18kHh2xCtk/" },
      { label: "No Means No (Safety)", url: "https://www.facebook.com/share/r/18YbrGRYzc/" }
    ]
  },
  {
    title: "Innovative Classroom",
    icon: "fa-lightbulb",
    color: "#FFF8E0",
    iconColor: "#D97706",
    links: [
      { label: "Innovative Classroom", url: "https://www.facebook.com/share/r/1DDpGRYdhB/" },
      { label: "Innovative Attendance", url: "https://www.facebook.com/share/r/1Bdo9yfLb9/" },
      { label: "Station Starter Ideas", url: "https://www.facebook.com/share/r/18btsS6fHb/" },
      { label: "Exciting Classroom 1", url: "https://www.facebook.com/share/r/1MK87MCahC/" },
      { label: "Exciting Classroom 2", url: "https://www.facebook.com/share/r/1DjZHAMXgS/" },
      { label: "Activity Categories", url: "https://www.facebook.com/share/r/1GUArkj1Sr/" }
    ]
  },
  {
    title: "Food & Nutrition",
    icon: "fa-apple-alt",
    color: "#ECFDF5",
    iconColor: "#059669",
    links: [
      { label: "Food & Nutrition Ref", url: "https://www.facebook.com/share/r/1JGj4nhQU9/" },
      { label: "Breakfast Time", url: "https://www.facebook.com/share/r/1RQMoPCTWq/" }
    ]
  }
];

const COURSES_DATA = [
  { title: "Early Childhood Education Program", duration: "6 Months", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600", desc: "Comprehensive foundation in child development and pedagogy, aligned with NEP 2020 and global ECE standards." },
  { title: "Preschool Teacher Training", duration: "6 Months", img: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600", desc: "Specialized training for nursery and kindergarten educators with hands-on practicum." },
  { title: "School Readiness Program", duration: "3 Months", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600", desc: "Preparing children for the transition to formal schooling through play-based learning strategies." },
  { title: "Montessori Teaching Basics", duration: "4 Months", img: "https://images.unsplash.com/photo-1596464716127-f9a0859b4bf6?auto=format&fit=crop&q=80&w=600", desc: "Introduction to Montessori philosophy, materials, and child-led discovery approach." },
  { title: "Inclusive Education Module", duration: "2 Months", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600", desc: "Supporting children with diverse learning needs in mainstream preschool environments." },
  { title: "Child Assessment & Documentation", duration: "1 Month", img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=600", desc: "Techniques for observing, recording, and communicating children's developmental progress." }
];

/* Full 6-month / 24-week plan derived from curriculum document */
const SIX_MONTH_PLAN = [
  /* ── MONTH 1 ── */
  {
    month: 1, label: "Month 1", title: "Foundations of Early Childhood Education",
    desc: "Understanding ECE fundamentals, child development theories, and the role of the teacher.",
    icon: "fa-seedling",
    topics: ["Introduction to ECE", "NEP 2020 & ICDS", "Child Development Milestones", "Learning Theories"],
    weeks: [
      {
        week: 1, title: "Introduction to ECE & the Teacher's Role",
        objectives: ["Understand the importance of ECE in India", "Explore NEP 2020 and ICDS frameworks", "Define the teacher's role in shaping early learning"],
        days: [
          { day: "Mon", topic: "What is ECE?", activity: "Group discussion on the purpose of early education" },
          { day: "Tue", topic: "NEP 2020 Overview", activity: "Reading & reflection on policy document excerpts" },
          { day: "Wed", topic: "ICDS Framework", activity: "Case study: ICDS Anganwadi model" },
          { day: "Thu", topic: "Role of the Preschool Teacher", activity: "Role-play: teacher vs. facilitator scenarios" },
          { day: "Fri", topic: "Global ECE Standards", activity: "Comparative chart: India vs. international ECE approaches" }
        ]
      },
      {
        week: 2, title: "Child Development Milestones",
        objectives: ["Identify physical, cognitive, social & emotional milestones (0–6 years)", "Understand individual differences in children", "Apply milestones to classroom observation"],
        days: [
          { day: "Mon", topic: "Physical Development (0–3 yrs)", activity: "Milestone checklist creation activity" },
          { day: "Tue", topic: "Physical Development (3–6 yrs)", activity: "Gross motor skills observation sheet" },
          { day: "Wed", topic: "Cognitive Development", activity: "Piaget's stages: sorting & classification tasks" },
          { day: "Thu", topic: "Social & Emotional Development", activity: "Story-based empathy activity" },
          { day: "Fri", topic: "Individual Differences", activity: "Portfolio: observe and document one child's behaviors" }
        ]
      },
      {
        week: 3, title: "Neuroscience of Early Brain Development",
        objectives: ["Explain brain development in the first 6 years", "Link neural connections to play and exploration", "Understand sensitive periods in learning"],
        days: [
          { day: "Mon", topic: "How the Baby Brain Grows", activity: "Visual: neural pathways infographic discussion" },
          { day: "Tue", topic: "Sensitive Periods & Windows of Opportunity", activity: "Montessori sensitive periods chart" },
          { day: "Wed", topic: "Role of Play in Brain Development", activity: "Play-based activity analysis worksheet" },
          { day: "Thu", topic: "Stress & Toxic Stress in Children", activity: "Case study: recognizing trauma indicators" },
          { day: "Fri", topic: "Week Review & Reflection", activity: "Journal entry: key neuroscience insights for teaching" }
        ]
      },
      {
        week: 4, title: "Early Learning Theories",
        objectives: ["Compare Montessori, Piaget, Vygotsky & Reggio Emilia", "Apply constructivist principles in lesson design", "Identify the best-fit theory for Indian classrooms"],
        days: [
          { day: "Mon", topic: "Montessori Philosophy", activity: "Hands-on Montessori material exploration" },
          { day: "Tue", topic: "Piaget's Constructivism", activity: "Concrete → pictorial → abstract activity sequence" },
          { day: "Wed", topic: "Vygotsky's ZPD & Scaffolding", activity: "Scaffolded puzzle activity with peer support" },
          { day: "Thu", topic: "Reggio Emilia Approach", activity: "Design a Reggio-inspired classroom environment plan" },
          { day: "Fri", topic: "Month 1 Assessment", activity: "Reflective quiz + peer discussion on learning theories" }
        ]
      }
    ]
  },
  /* ── MONTH 2 ── */
  {
    month: 2, label: "Month 2", title: "Curriculum Planning & Learning Environment",
    desc: "Lesson planning frameworks, activity design, and creating stimulating classroom spaces.",
    icon: "fa-chalkboard",
    topics: ["Lesson Plan Development", "Activity-Based Learning", "Classroom Setup", "Learning Corners"],
    weeks: [
      {
        week: 5, title: "Developing Effective Lesson Plans",
        objectives: ["Write SMART learning objectives", "Structure daily and weekly plans", "Integrate themes across domains"],
        days: [
          { day: "Mon", topic: "Structure of a Lesson Plan", activity: "Dissect 3 sample lesson plans – identify strengths" },
          { day: "Tue", topic: "SMART Objectives Writing", activity: "Convert vague goals into SMART objectives" },
          { day: "Wed", topic: "Weekly Thematic Planning", activity: "Create a week-long 'Seasons' theme plan" },
          { day: "Thu", topic: "Age-Appropriate Activity Selection", activity: "Match activities to developmental stages" },
          { day: "Fri", topic: "Download & Explore Lesson Plan Templates", activity: "Use SpacECE Lesson Plan files (all languages)" }
        ]
      },
      {
        week: 6, title: "Activity-Based Learning Design",
        objectives: ["Design sensory, cognitive, language & motor activities", "Understand free vs. structured play", "Create a balanced daily schedule"],
        days: [
          { day: "Mon", topic: "Sensory Play Activities", activity: "Sensory bin creation: sand, water, clay" },
          { day: "Tue", topic: "Cognitive & Problem-Solving Activities", activity: "Puzzle & sorting game design workshop" },
          { day: "Wed", topic: "Language Activities", activity: "Story bag and flannel board activity creation" },
          { day: "Thu", topic: "Gross & Fine Motor Activities", activity: "Obstacle course + threading/lacing activity" },
          { day: "Fri", topic: "Balancing Free & Structured Play", activity: "Create a balanced daily routine chart" }
        ]
      },
      {
        week: 7, title: "Setting Up the Learning Environment",
        objectives: ["Design a safe, stimulating classroom layout", "Understand the importance of display and space", "Create inclusive spaces for all learners"],
        days: [
          { day: "Mon", topic: "Classroom Layout Principles", activity: "Floor plan design: classroom of 20 children" },
          { day: "Tue", topic: "Display & Print-Rich Environment", activity: "Create a bilingual word wall" },
          { day: "Wed", topic: "Learning Corners: Art & Science", activity: "Set up art corner with recycled materials" },
          { day: "Thu", topic: "Reading & Block Corners", activity: "Curate age-appropriate book collection" },
          { day: "Fri", topic: "Outdoor Learning Spaces", activity: "Design outdoor activity station plan" }
        ]
      },
      {
        week: 8, title: "Scheduling & Routine Design",
        objectives: ["Understand the value of predictable routines", "Create transition strategies between activities", "Plan morning, midday & afternoon sessions"],
        days: [
          { day: "Mon", topic: "Importance of Routine for Young Children", activity: "Discuss: how routines build security and learning" },
          { day: "Tue", topic: "Morning Circle Time Planning", activity: "Script a 20-minute morning circle" },
          { day: "Wed", topic: "Transition Strategies", activity: "Create 5 transition songs/signals" },
          { day: "Thu", topic: "Full Day Schedule Design", activity: "Build a 6-hour preschool timetable" },
          { day: "Fri", topic: "Month 2 Portfolio Review", activity: "Share lesson plan drafts for peer feedback" }
        ]
      }
    ]
  },
  /* ── MONTH 3 ── */
  {
    month: 3, label: "Month 3", title: "Instructional Strategies & Teaching Techniques",
    desc: "Core teaching methods for Literacy, Numeracy, STEM, and Creative Arts in the early years.",
    icon: "fa-book-open",
    topics: ["Language & Literacy", "Numeracy Concepts", "STEM Exploration", "Creative Arts"],
    weeks: [
      {
        week: 9, title: "Teaching Language & Early Literacy",
        objectives: ["Use storytelling, rhymes & phonics effectively", "Develop listening, speaking, reading & writing skills", "Understand emergent literacy progression"],
        days: [
          { day: "Mon", topic: "Oral Language Development", activity: "Puppetry and storytelling demonstration" },
          { day: "Tue", topic: "Phonological Awareness & Phonics", activity: "Rhyme, alliteration & onset-rime games" },
          { day: "Wed", topic: "Emergent Reading Strategies", activity: "Shared reading with big books" },
          { day: "Thu", topic: "Early Writing: Marks to Letters", activity: "Mark-making station with varied tools" },
          { day: "Fri", topic: "Multilingual Literacy", activity: "Bilingual story session using SpacECE Alphabet books" }
        ]
      },
      {
        week: 10, title: "Teaching Early Numeracy",
        objectives: ["Introduce pre-math concepts: number, pattern, shape, measurement", "Use hands-on materials for mathematical thinking", "Connect maths to everyday life"],
        days: [
          { day: "Mon", topic: "Number Sense & Counting", activity: "Count & sort objects; one-to-one correspondence" },
          { day: "Tue", topic: "Patterns & Sequencing", activity: "Bead threading & colour pattern activities" },
          { day: "Wed", topic: "Shapes & Spatial Awareness", activity: "Shape hunt around the classroom" },
          { day: "Thu", topic: "Measurement & Comparison", activity: "Compare lengths, weights using non-standard units" },
          { day: "Fri", topic: "Maths Through Play", activity: "Maths games station rotation (SpacECE curriculum books)" }
        ]
      },
      {
        week: 11, title: "STEM in Early Education",
        objectives: ["Design simple science investigations for young children", "Introduce basic technology concepts age-appropriately", "Foster curiosity, questioning & exploration"],
        days: [
          { day: "Mon", topic: "Science Through Senses", activity: "Sink/float, dissolve/not-dissolve experiments" },
          { day: "Tue", topic: "Observation & Inquiry Skills", activity: "Nature journal: draw and describe a leaf" },
          { day: "Wed", topic: "Simple Engineering Challenges", activity: "Build a bridge from paper and sticks" },
          { day: "Thu", topic: "Tech Literacy for Young Children", activity: "Introduce safe digital tools for learning" },
          { day: "Fri", topic: "STEM Integration in Theme Planning", activity: "Redesign a lesson plan with STEM lens" }
        ]
      },
      {
        week: 12, title: "Creative Arts in Early Learning",
        objectives: ["Use art, music, dance & drama as learning tools", "Encourage imagination and process-over-product", "Connect creative arts to other curriculum areas"],
        days: [
          { day: "Mon", topic: "Visual Arts: Drawing & Painting", activity: "Process art session: free painting" },
          { day: "Tue", topic: "Music & Movement", activity: "Action songs and rhythm instruments" },
          { day: "Wed", topic: "Drama & Role Play", activity: "Dress-up corner + scenario cards" },
          { day: "Thu", topic: "Dance & Body Awareness", activity: "Moving to music: fast, slow, high, low" },
          { day: "Fri", topic: "Month 3 Micro-Teaching", activity: "Each trainee teaches a 10-min creative arts activity" }
        ]
      }
    ]
  },
  /* ── MONTH 4 ── */
  {
    month: 4, label: "Month 4", title: "Assessment, Behavior & Inclusive Practices",
    desc: "Child observation, assessment tools, positive discipline, and inclusive classroom strategies.",
    icon: "fa-hands-helping",
    topics: ["Observation & Documentation", "Developmental Assessment", "Positive Discipline", "Inclusive Education"],
    weeks: [
      {
        week: 13, title: "Observation & Documentation Techniques",
        objectives: ["Use anecdotal records, running records & checklists", "Build a child portfolio", "Document learning without bias"],
        days: [
          { day: "Mon", topic: "Why Observe? Purpose of Assessment in ECE", activity: "Discuss: observation vs. judgment" },
          { day: "Tue", topic: "Anecdotal Records", activity: "Practice writing objective anecdotal notes" },
          { day: "Wed", topic: "Running Records & Checklists", activity: "Use SpacECE Field Work Tracker (Months 1–3)" },
          { day: "Thu", topic: "Building a Child Portfolio", activity: "Collect work samples + photos for mock portfolio" },
          { day: "Fri", topic: "Digital Documentation Tools", activity: "Explore safe photo-sharing & documentation apps" }
        ]
      },
      {
        week: 14, title: "Developmental Assessment Tools",
        objectives: ["Administer cognitive, motor & social-emotional assessments", "Interpret results without labelling children", "Use SpacECE Field Work Tracker (4–6 months)"],
        days: [
          { day: "Mon", topic: "Types of Assessment: Formative vs. Summative", activity: "Compare approaches with case examples" },
          { day: "Tue", topic: "Cognitive & Language Assessment Tools", activity: "Administer a sample language screener" },
          { day: "Wed", topic: "Motor Skills Assessment", activity: "Gross & fine motor checklist: peer practice" },
          { day: "Thu", topic: "Social-Emotional Assessment", activity: "Use temperament & social skills observation rubric" },
          { day: "Fri", topic: "Reporting to Parents", activity: "Write a sample parent progress report" }
        ]
      },
      {
        week: 15, title: "Positive Discipline & Behavior Guidance",
        objectives: ["Set clear, consistent classroom rules", "Use positive reinforcement strategies", "Manage challenging behaviors compassionately"],
        days: [
          { day: "Mon", topic: "Understanding Behavior as Communication", activity: "Case study: decoding a child's challenging behavior" },
          { day: "Tue", topic: "Setting Rules & Boundaries", activity: "Co-create classroom rules with children (role-play)" },
          { day: "Wed", topic: "Positive Reinforcement Techniques", activity: "Reward systems: stickers, star charts, praise" },
          { day: "Thu", topic: "De-escalation Strategies", activity: "Practice calm-down corner setup and scripts" },
          { day: "Fri", topic: "Social Skills Building", activity: "Conflict resolution role-play scenarios" }
        ]
      },
      {
        week: 16, title: "Inclusive Education & Diversity",
        objectives: ["Support children with special learning needs", "Celebrate cultural diversity in the classroom", "Adapt activities for all learners"],
        days: [
          { day: "Mon", topic: "Principles of Inclusive Education", activity: "Watch & discuss: inclusion short film" },
          { day: "Tue", topic: "Identifying Special Learning Needs", activity: "Red flag indicators checklist exercise" },
          { day: "Wed", topic: "Adapting Activities for Inclusion", activity: "Modify 3 activities for diverse learners" },
          { day: "Thu", topic: "Celebrating Cultural Diversity", activity: "Design a multicultural classroom calendar" },
          { day: "Fri", topic: "Month 4 Assessment", activity: "Mock assessment: observe child video + write report" }
        ]
      }
    ]
  },
  /* ── MONTH 5 ── */
  {
    month: 5, label: "Month 5", title: "Family Partnerships, Health & Professional Practice",
    desc: "Working with families, community engagement, child safety, nutrition, and reflective teaching.",
    icon: "fa-school",
    topics: ["Parent-Teacher Partnerships", "Community Engagement", "Child Safety", "Reflective Practice"],
    weeks: [
      {
        week: 17, title: "Parent-Teacher Partnerships",
        objectives: ["Conduct productive parent meetings", "Share progress updates effectively", "Create a family engagement plan"],
        days: [
          { day: "Mon", topic: "Importance of Family Engagement", activity: "Research: impact of parent involvement on learning" },
          { day: "Tue", topic: "Parent-Teacher Conference Skills", activity: "Role-play: delivering difficult feedback sensitively" },
          { day: "Wed", topic: "Activity Calendars & Newsletters", activity: "Design a monthly family newsletter" },
          { day: "Thu", topic: "Parent Workshops", activity: "Plan a 1-hour parenting workshop on play at home" },
          { day: "Fri", topic: "Parents Capacity Building Materials", activity: "Review SpacECE Parents Capacity Building resource" }
        ]
      },
      {
        week: 18, title: "Community Engagement & Advocacy",
        objectives: ["Leverage local resources for enriched learning", "Advocate for early childhood education", "Build a network of support for families"],
        days: [
          { day: "Mon", topic: "The Community as a Classroom", activity: "Map community resources relevant to ECE" },
          { day: "Tue", topic: "Inviting Community Helpers", activity: "Plan a 'Community Helpers Week'" },
          { day: "Wed", topic: "Local Culture in the Curriculum", activity: "Incorporate local festivals & traditions in lesson plans" },
          { day: "Thu", topic: "Advocacy for ECE", activity: "Write a short advocacy letter to a local official" },
          { day: "Fri", topic: "Networking & Professional Learning", activity: "Explore MOOCs, webinars, and ECE groups" }
        ]
      },
      {
        week: 19, title: "Child Health, Safety & Nutrition",
        objectives: ["Implement child safety and safeguarding protocols", "Teach hygiene habits to young children", "Plan nutritious snack and meal activities"],
        days: [
          { day: "Mon", topic: "Child Protection & Safeguarding", activity: "Recognize indicators of abuse: case study" },
          { day: "Tue", topic: "Emergency Preparedness & First Aid", activity: "Basic first aid demonstration: cuts, choking" },
          { day: "Wed", topic: "Teaching Hygiene to Children", activity: "Create a hand-washing song and poster" },
          { day: "Thu", topic: "Nutrition Basics for Early Childhood", activity: "Design a balanced weekly snack plan" },
          { day: "Fri", topic: "Physical Activity & Fitness", activity: "Plan 5 outdoor movement activities" }
        ]
      },
      {
        week: 20, title: "Reflective Teaching & Professional Ethics",
        objectives: ["Practice self-evaluation and peer feedback", "Understand ethics and professionalism in ECE", "Begin building a professional portfolio"],
        days: [
          { day: "Mon", topic: "What is Reflective Teaching?", activity: "Start a reflective teaching journal" },
          { day: "Tue", topic: "Self-Evaluation Frameworks", activity: "Use a teaching reflection rubric on a recorded lesson" },
          { day: "Wed", topic: "Peer Observation & Feedback", activity: "Observe a peer and give structured feedback" },
          { day: "Thu", topic: "Ethics & Professionalism in ECE", activity: "Discuss ethical dilemmas: case studies" },
          { day: "Fri", topic: "Building Your Professional Portfolio", activity: "Compile Month 1–5 work into portfolio framework" }
        ]
      }
    ]
  },
  /* ── MONTH 6 ── */
  {
    month: 6, label: "Month 6", title: "Capstone Project, Practicum & Certification",
    desc: "Real classroom teaching experience, capstone project, portfolio completion, and final assessment.",
    icon: "fa-certificate",
    topics: ["Classroom Practicum", "Micro-Teaching", "Capstone Project", "Final Assessment"],
    weeks: [
      {
        week: 21, title: "Practicum Preparation & Classroom Visits",
        objectives: ["Understand practicum guidelines and expectations", "Complete classroom observation visits", "Set personal teaching goals for practicum"],
        days: [
          { day: "Mon", topic: "Practicum Orientation & Guidelines", activity: "Review SpacECE Field Work Tracker (4–6 Months)" },
          { day: "Tue", topic: "Classroom Observation Visit 1", activity: "Shadow an experienced preschool teacher" },
          { day: "Wed", topic: "Post-Observation Debrief", activity: "Write observation report using anecdotal format" },
          { day: "Thu", topic: "Classroom Observation Visit 2", activity: "Focus on transitions and behavior guidance" },
          { day: "Fri", topic: "Personal Teaching Goal Setting", activity: "Write SMART goals for teaching practice" }
        ]
      },
      {
        week: 22, title: "Micro-Teaching Practice Sessions",
        objectives: ["Deliver 3 micro-teaching lessons (15 min each)", "Receive and apply mentor feedback", "Refine lesson planning and delivery skills"],
        days: [
          { day: "Mon", topic: "Micro-Teaching Session 1: Language Activity", activity: "Teach a story + phonics mini-lesson to peers" },
          { day: "Tue", topic: "Feedback & Reflection on Session 1", activity: "Mentor debrief using structured feedback form" },
          { day: "Wed", topic: "Micro-Teaching Session 2: Math Activity", activity: "Teach a counting/patterning game to peers" },
          { day: "Thu", topic: "Feedback & Reflection on Session 2", activity: "Self-evaluate using video playback" },
          { day: "Fri", topic: "Micro-Teaching Session 3: Creative Arts", activity: "Teach a music or movement activity to peers" }
        ]
      },
      {
        week: 23, title: "Capstone Project Development",
        objectives: ["Design and implement a 3-day thematic unit plan", "Document with photos, samples & reflections", "Present to a panel for assessment"],
        days: [
          { day: "Mon", topic: "Capstone Project Brief & Expectations", activity: "Choose theme + draft unit plan outline" },
          { day: "Tue", topic: "Develop Full 3-Day Unit Plan", activity: "Write detailed plans for 3 consecutive teaching days" },
          { day: "Wed", topic: "Resource Preparation for Capstone", activity: "Create all materials, visual aids and activities" },
          { day: "Thu", topic: "Teach Capstone Unit Day 1 & 2", activity: "Deliver in real preschool or simulated classroom" },
          { day: "Fri", topic: "Teach Capstone Unit Day 3 & Documentation", activity: "Final teaching day + collect evidence for portfolio" }
        ]
      },
      {
        week: 24, title: "Portfolio Completion & Certification",
        objectives: ["Finalize professional teaching portfolio", "Sit for final written and practical assessment", "Graduate and receive SpacECE certification"],
        days: [
          { day: "Mon", topic: "Portfolio Compilation & Review", activity: "Final portfolio check: all sections complete?" },
          { day: "Tue", topic: "Capstone Project Presentation", activity: "Present 10-minute project summary to panel" },
          { day: "Wed", topic: "Written Final Assessment", activity: "Comprehensive written exam on all 6 months" },
          { day: "Thu", topic: "Practical Assessment", activity: "Teach a 20-min lesson evaluated by mentor panel" },
          { day: "Fri", topic: "Graduation & Certification Ceremony", activity: "Award of SpacECE Certificate + career guidance session" }
        ]
      }
    ]
  }
];

/* ============================================================
   NAVIGATION
   ============================================================ */
let currentPage = 'home';

function navigate(pageId) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  // show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    target.classList.add('page-enter');
    setTimeout(() => target.classList.remove('page-enter'), 400);
  }
  // update nav active states
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });
  currentPage = pageId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // close mobile menu
  const mobileMenu = document.getElementById('nav-mobile');
  const hamburger  = document.getElementById('hamburger');
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger)  hamburger.classList.remove('open');
  initObservers();
}

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;
  grid.innerHTML = COURSES_DATA.map(c => `
    <div class="card course-card fade-in">
      <div class="course-thumb">
        <img src="${c.img}" alt="${c.title}" loading="lazy">
        <span class="course-duration"><i class="far fa-clock"></i> ${c.duration}</span>
      </div>
      <div class="course-body">
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
      </div>
      <div class="course-footer">
        <a href="#" class="btn btn-outline btn-sm" onclick="return false;"><i class="fab fa-youtube"></i> Preview</a>
        <button class="btn btn-primary btn-sm" onclick="navigate('contact')">Enquire Now</button>
      </div>
    </div>
  `).join('');
}

function renderTimeline() {
  const wrap = document.getElementById('timeline-wrap');
  if (!wrap) return;
  wrap.innerHTML = `<div class="timeline-track"></div>` + SIX_MONTH_PLAN.map(m => `
    <div class="timeline-item fade-in">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-month"><i class="fas ${m.icon} mr-1"></i> ${m.label}</div>
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
        <div class="timeline-topics">
          ${m.topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* Weekly Plan – rendered dynamically */
let activeMonthTab = 1;

function renderWeeklyTabs() {
  const tabs = document.getElementById('month-tabs');
  if (!tabs) return;
  tabs.innerHTML = SIX_MONTH_PLAN.map(m => `
    <button class="month-tab ${m.month === activeMonthTab ? 'active' : ''}" onclick="switchMonth(${m.month})">
      <i class="fas ${m.icon} mr-1"></i> ${m.label}
    </button>
  `).join('');
}

function switchMonth(n) {
  activeMonthTab = n;
  renderWeeklyTabs();
  renderWeeklyGrid();
}

function renderWeeklyGrid() {
  const grid = document.getElementById('weekly-grid');
  if (!grid) return;
  const monthData = SIX_MONTH_PLAN.find(m => m.month === activeMonthTab);
  if (!monthData) return;

  grid.innerHTML = monthData.weeks.map(w => `
    <div class="week-row fade-in" id="week-row-${w.week}">
      <div class="week-header" onclick="toggleWeek(${w.week})">
        <span class="week-num">Week ${w.week}</span>
        <span class="week-title">${w.title}</span>
        <i class="fas fa-chevron-down week-chevron"></i>
      </div>
      <div class="week-content">
        <div class="week-objectives">
          <h5><i class="fas fa-bullseye mr-1"></i> Learning Objectives</h5>
          <ul>${w.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
        </div>
        <div class="week-days">
          ${w.days.map(d => `
            <div class="day-card">
              <div class="day-name">${d.day}</div>
              <div class="day-topic">${d.topic}</div>
              <div class="day-activity">${d.activity}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
  initObservers();
}

function toggleWeek(weekNum) {
  const row = document.getElementById('week-row-' + weekNum);
  if (row) row.classList.toggle('open');
}

/* Curriculum Library */
let openLevel = {};
let openEssentials = {};

function renderCurriculum() {
  const wrap = document.getElementById('curriculum-wrap');
  if (!wrap) return;
  const langs = ['english', 'hindi', 'marathi', 'gujarati'];
  wrap.innerHTML = langs.map(lang => {
    const data = CURRICULUM_DATA[lang];
    const capLang = lang.charAt(0).toUpperCase() + lang.slice(1);
    const levelsHtml = ['level1','level2','level3','level4'].map((lvl, li) => {
      const label = `Level ${li + 1}`;
      const isOpen = openLevel[`${lang}-${lvl}`];
      return `
        <div class="level-card ${isOpen ? 'active' : ''}" id="lc-${lang}-${lvl}">
          <div class="level-header" onclick="toggleLevel('${lang}','${lvl}')">
            <span>${label}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="level-books">
            ${data[lvl].map(b => `
              <a href="${b.link}" target="_blank" rel="noopener noreferrer" class="book-link">
                <span class="book-left"><i class="fas ${b.icon}"></i> ${b.title}</span>
                <span class="drive-btn"><i class="fab fa-google-drive"></i> Drive</span>
              </a>
            `).join('')}
          </div>
        </div>`;
    }).join('');

    const essOpen = openEssentials[lang];
    const essHtml = data.essentials.map(e => `
      <a href="${e.link}" target="_blank" rel="noopener noreferrer" class="essential-link">
        <i class="fas ${e.icon}"></i> ${e.title}
      </a>`).join('');

    return `
      <div class="lang-section fade-in">
        <div class="lang-header">
          <h3><span></span>${capLang} Curriculum</h3>
          <button class="btn btn-outline btn-sm" onclick="toggleEssentials('${lang}')">
            <i class="fas fa-star"></i> Training Essentials
          </button>
        </div>
        <div class="essentials-panel ${essOpen ? 'open' : ''}" id="ess-${lang}">
          <p style="font-size:13px;color:var(--muted);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Essential Downloads</p>
          <div class="essentials-grid">${essHtml}</div>
        </div>
        <div class="levels-grid">${levelsHtml}</div>
      </div>`;
  }).join('');
}

function toggleLevel(lang, lvl) {
  const key = `${lang}-${lvl}`;
  openLevel[key] = !openLevel[key];
  renderCurriculum();
  initObservers();
}

function toggleEssentials(lang) {
  openEssentials[lang] = !openEssentials[lang];
  const panel = document.getElementById('ess-' + lang);
  if (panel) panel.classList.toggle('open');
}

/* Handbook */
function renderHandbook() {
  const langs = Object.keys(CURRICULUM_DATA);
  const btnWrap = document.getElementById('handbook-lang-btns');
  if (!btnWrap) return;
  btnWrap.innerHTML = langs.map(lang => `
    <a href="${CURRICULUM_DATA[lang].essentials[2].link}" target="_blank" rel="noopener noreferrer"
       class="btn btn-drive btn-sm"><i class="fab fa-google-drive"></i> ${lang.charAt(0).toUpperCase()+lang.slice(1)}</a>
  `).join('');
}

/* Field Work */
function renderFieldWork() {
  const wrap = document.getElementById('tracker-cards');
  if (!wrap) return;
  wrap.innerHTML = Object.keys(CURRICULUM_DATA).map(lang => `
    <div class="tracker-card card">
      <h4>${lang.charAt(0).toUpperCase()+lang.slice(1)}</h4>
      <div class="tracker-links">
        <a href="${CURRICULUM_DATA[lang].essentials[0].link}" target="_blank" rel="noopener noreferrer" class="tracker-link">
          <i class="fas fa-clipboard-check"></i> Months 1–3
        </a>
        <a href="${CURRICULUM_DATA[lang].essentials[1].link}" target="_blank" rel="noopener noreferrer" class="tracker-link">
          <i class="fas fa-clipboard-check"></i> Months 4–6
        </a>
      </div>
    </div>
  `).join('');
}

/* Lesson Planning */
function renderLessonPlanning() {
  const wrap = document.getElementById('lesson-plan-langs');
  if (!wrap) return;
  wrap.innerHTML = Object.keys(CURRICULUM_DATA).map(lang => `
    <a href="${CURRICULUM_DATA[lang].essentials[3].link}" target="_blank" rel="noopener noreferrer" class="planning-lang-btn">
      <i class="fas fa-language"></i>
      ${lang.charAt(0).toUpperCase()+lang.slice(1)} Lesson Plan
    </a>
  `).join('');
}

/* Resources */
function renderResources() {
  const grid = document.getElementById('resources-grid');
  if (!grid) return;
  grid.innerHTML = EXTRA_RESOURCES.map(r => `
    <div class="card resource-card fade-in">
      <div class="resource-icon"><i class="fas ${r.icon}"></i></div>
      <h4>${r.title}</h4>
      <p>${r.desc}</p>
      <a href="${r.link}" target="_blank" rel="noopener noreferrer">
        Open <i class="fas fa-external-link-alt"></i>
      </a>
    </div>
  `).join('');

  /* Station Activity Bank */
  const stationWrap = document.getElementById('station-activity-bank');
  if (!stationWrap) return;
  stationWrap.innerHTML = STATION_ACTIVITIES.map(s => `
    <div class="card station-card fade-in">
      <div class="station-card-header">
        <div class="station-icon-wrap" style="background:${s.color};color:${s.iconColor};">
          <i class="fas ${s.icon}"></i>
        </div>
        <h4>${s.title}</h4>
      </div>
      <div class="station-links">
        ${s.links.map(l => `
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="station-link">
            <i class="fab fa-facebook" style="color:#1877F2;font-size:12px;"></i>
            <span>${l.label}</span>
            <i class="fas fa-external-link-alt" style="margin-left:auto;font-size:10px;color:var(--muted);"></i>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* Language Station */
function renderLangStation() {
  const pdfsGrid = document.getElementById('langstation-pdfs-grid');
  if (pdfsGrid) {
    pdfsGrid.innerHTML = LANGSTATION_PDFS.map(p => `
      <div class="card resource-card fade-in">
        <div class="resource-icon"><i class="fas ${p.icon}"></i></div>
        <h4>${p.title}</h4>
        <p style="font-size:12px;color:var(--muted);margin-bottom:4px;word-break:break-all;"><i class="fas fa-folder" style="margin-right:4px;"></i>${p.path}</p>
        <p>${p.desc}</p>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-file-pdf"></i> Open PDF
        </a>
      </div>
    `).join('');
  }

  const playlistsGrid = document.getElementById('langstation-playlists-grid');
  if (playlistsGrid) {
    playlistsGrid.innerHTML = LANGSTATION_PLAYLISTS.map(pl => `
      <div class="card resource-card fade-in">
        <div class="resource-icon" style="background:rgba(255,0,0,0.1);"><i class="fab fa-youtube" style="color:#ff0000;"></i></div>
        <h4>${pl.title}</h4>
        <p>${pl.desc}</p>
        <a href="${pl.link}" target="_blank" rel="noopener noreferrer">
          Watch Playlist <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `).join('');
  }

  const perfGrid = document.getElementById('langstation-performances-grid');
  if (perfGrid) {
    perfGrid.innerHTML = LANGSTATION_PERFORMANCES.map(pf => `
      <div class="card resource-card fade-in">
        <div class="resource-icon" style="background:rgba(255,165,0,0.1);"><i class="fas ${pf.icon}" style="color:var(--orange);"></i></div>
        <h4>${pf.title}</h4>
        <p>${pf.desc}</p>
        <a href="${pf.link}" target="_blank" rel="noopener noreferrer">
          View <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `).join('');
  }
}

/* ============================================================
   INTERSECTION OBSERVER (fade-in)
   ============================================================ */
function initObservers() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
}

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }
}

/* ============================================================
   COUNTER ANIMATION (hero stats)
   ============================================================ */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    const step = dur / target;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + Math.ceil(target / 80), target);
      el.textContent = current + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, step);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Set logo images
  document.querySelectorAll('.site-logo').forEach(img => {
    img.src = ASSETS.logo;
    img.alt = 'SpacECE India Foundation';
  });
  // Set hero image
  const heroImg = document.getElementById('hero-img');
  if (heroImg) heroImg.src = ASSETS.hero;
  const aboutMain = document.getElementById('about-main-img');
  if (aboutMain) aboutMain.src = ASSETS.aboutMain;
  const aboutSmall = document.getElementById('about-small-img');
  if (aboutSmall) aboutSmall.src = ASSETS.aboutSmall;
  // Set google form link
  document.querySelectorAll('.google-form-link').forEach(a => a.href = ASSETS.googleForm);

  initNavbar();
  renderCourses();
  renderTimeline();
  renderWeeklyTabs();
  renderWeeklyGrid();
  renderCurriculum();
  renderHandbook();
  renderFieldWork();
  renderLessonPlanning();
  renderResources();
  renderLangStation();

  navigate('home');
  setTimeout(animateCounters, 600);
});