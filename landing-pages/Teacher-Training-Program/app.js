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
  {
    title: "Preschool Teacher Training",
    duration: "6 Months",
    img: "1st.jpg",
    desc: "Master the essential skills every preschool teacher needs — from classroom setup and daily routines to building warm relationships with children that spark a lifelong love of learning.",
   /* videoId: "3Ok2VGpfRtM",*/
    highlights: ["10 Keys to Success", "Daily Routine Design", "Teacher–Child Bonding", "Certification Included"]
  },
  {
    title: "Classroom Management for Teachers",
    duration: "2 Months",
    img: "2nd.jpg",
    desc: "Learn proven strategies to manage preschool classrooms with empathy and confidence — positive discipline, transitions, behaviour guidance, and creating a safe space for every student.",
    /*videoId: "bAXToCVjcdk",*/
    highlights: ["Positive Discipline", "Behaviour Guidance", "Smooth Transitions", "Empathy-Based Teaching"]
  },
  {
    title: "Montessori Teaching Basics",
    duration: "4 Months",
    img: "3rd.jpg",
    desc: "Understand the Montessori philosophy from the ground up — child-led discovery, prepared environments, sensitive periods, and hands-on materials adapted for Indian classrooms.",
    /*videoId: "eY2Y2DfosYI",*/
    highlights: ["Child-Led Discovery", "Prepared Environment", "Sensitive Periods", "Montessori Materials"]
  },
  {
    title: "Play-Based Learning Design",
    duration: "2 Months",
    img: "4th.jpg",
    desc: "Design rich, purposeful play experiences that teachers can use to build cognitive, social, emotional, and language skills in students aged 2–6.",
    /*videoId: "_PIuorhLj0c",*/
    highlights: ["Free & Guided Play", "Sensory Activities", "Station-Based Learning", "Activity Design"]
  },
  {
    title: "Early Literacy for Students",
    duration: "2 Months",
    img: "5th.jpg",
    desc: "Equip teachers with powerful early literacy strategies — read-alouds, phonemic awareness, storytelling, and language-rich environments that help students learn to read and write.",
    /*videoId: "-fNm4aa3Hr0",*/
    highlights: ["Phonics Methods", "Read-Aloud Techniques", "Story-Based Learning", "Language-Rich Classroom"]
  },
  {
    title: "Student Assessment & Documentation",
    duration: "1 Month",
    img: "6th.jpg",
    desc: "Learn how to observe, record, and communicate each student's developmental progress — building portfolios, using checklists, and sharing meaningful reports with parents.",
    /*videoId: "VT7dkEjjkyc",*/
    highlights: ["Portfolio Building", "Observation Checklists", "Progress Reporting", "Parent Communication"]
  },
  {
    title: "School Readiness Program",
    duration: "3 Months",
    img: "7th.jpg",
    desc: "Prepare students confidently for formal school — teachers learn to develop the social, emotional, and cognitive skills children need to thrive in Grade 1 and beyond.",
    /*videoId: "3Ok2VGpfRtM",*/
    highlights: ["Social Skills", "Pre-Academic Concepts", "Emotional Readiness", "Smooth School Transition"]
  },
  {
    title: "Inclusive Classroom Practices",
    duration: "2 Months",
    img: "8th.jpg",
    desc: "Support every student regardless of ability — teachers gain tools to differentiate learning, accommodate diverse needs, and create truly inclusive preschool environments.",
    /*videoId: "ySOgtwlLy1w",*/
    highlights: ["Differentiated Learning", "Special Needs Support", "Inclusive Strategies", "Every Child Matters"]
  },
  {
    title: "Teacher–Student Relationship Building",
    duration: "1 Month",
    img: "9th.jpg",
    desc: "Build warm, trusting relationships with students that form the foundation of all effective teaching — attachment theory, responsive caregiving, and emotional safety in the classroom.",
    /*videoId: "7XytnZJ-90U",*/
    highlights: ["Attachment Theory", "Responsive Caregiving", "Emotional Safety", "Trust Building"]
  },
  {
    title: "Early Childhood Education Program",
    duration: "6 Months",
    img: "10th.jpg",
    desc: "The complete 6-month flagship program — child development, curriculum design, teaching strategies, student assessment, family engagement, and real classroom practicum.",
    /*videoId: "fuoCgt5gGNc",*/
    highlights: ["NEP 2020 Aligned", "24-Week Plan", "Real Practicum", "Full Certification"]
  }
];
/* Full 6-month / 24-week plan derived from curriculum document with real curated video IDs and academic resources */
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
          { day: "Mon", topic: "What is ECE?", activity: "Group discussion on the purpose of early education",/* videoId: "7S0Sly6vBwQ",*/ resource: { type: "Journal", title: "UNESCO: Early Childhood Care and Education", link: "https://unesdoc.unesco.org/ark:/48223/pf0000373414" } },
          { day: "Tue", topic: "NEP 2020 Overview", activity: "Reading & reflection on policy document excerpts",/* videoId: "L_M98pG87io",*/ resource: { type: "Policy", title: "MHRD: National Education Policy 2020 PDF", link: "https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf" } },
          { day: "Wed", topic: "ICDS Framework", activity: "Case study: ICDS Anganwadi model",/* videoId: "NezqZ8vR0o8",*/ resource: { type: "News", title: "The Hindu: Transforming Anganwadis into Hubs of Early Learning", link: "https://www.thehindu.com/news/national/transforming-anganwadis/article65002131.ece" } },
          { day: "Thu", topic: "Role of the Preschool Teacher", activity: "Role-play: teacher vs. facilitator scenarios", /*videoId: "0b3M7pXG09o",*/ resource: { type: "Journal", title: "NAEYC: The Role of the Facilitator in Early Classrooms", link: "https://www.naeyc.org/resources/pubs/yc/past-issues" } },
          { day: "Fri", topic: "Global ECE Standards", activity: "Comparative chart: India vs. international ECE approaches",/* videoId: "3m0VvC4wMhM",*/ resource: { type: "Journal", title: "OECD: Starting Strong - Early Childhood Education and Care Evaluation", link: "https://www.oecd.org/education/school/startingstrong.htm" } }
        ]
      },
      {
        week: 2, title: "Child Development Milestones",
        objectives: ["Identify physical, cognitive, social & emotional milestones (0–6 years)", "Understand individual differences in children", "Apply milestones to classroom observation"],
        days: [
          { day: "Mon", topic: "Physical Development (0–3 yrs)", activity: "Milestone checklist creation activity",/* videoId: "k3D0_FwS97k",*/ resource: { type: "Journal", title: "CDC: Developmental Milestones Tracker", link: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html" } },
          { day: "Tue", topic: "Physical Development (3–6 yrs)", activity: "Gross motor skills observation sheet", /*videoId: "7T08rU8c8gU"*/ resource: { type: "Journal", title: "WHO: Physical Activity Guidelines for Children Under 5", link: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" } },
          { day: "Wed", topic: "Cognitive Development", activity: "Piaget's stages: sorting & classification tasks", /*videoId: "IhcgYgx7aAA",*/ resource: { type: "Journal", title: "Simply Psychology: Piaget's 4 Stages of Cognitive Development", link: "https://www.simplypsychology.org/piaget.html" } },
          { day: "Thu", topic: "Social & Emotional Development", activity: "Story-based empathy activity", /*videoId: "IhcgYgx7aAA",*/ resource: { type: "Journal", title: "Harvard Center: Center on the Developing Child - Social Emotional Framework", link: "https://developingchild.harvard.edu/science/key-concepts/executive-function/" } },
          { day: "Fri", topic: "Individual Differences", activity: "Portfolio: observe and document one child's behaviors",/*videoId: "IhcgYgx7aAA",*/ resource: { type: "News", title: "Edutopia: Embracing Neurodiversity in Early Childhood", link: "https://www.edutopia.org/article/neurodiversity-early-childhood-classrooms" } }
        ]
      },
      {
        week: 3, title: "Neuroscience of Early Brain Development",
        objectives: ["Explain brain development in the first 6 years", "Link neural connections to play and exploration", "Understand sensitive periods in learning"],
        days: [
          { day: "Mon", topic: "How the Baby Brain Grows", activity: "Visual: neural pathways infographic discussion", /*videoId: "IhcgYgx7aAA",*/ resource: { type: "Journal", title: "Harvard Center: InBrief - The Science of Early Childhood Development", link: "https://developingchild.harvard.edu/resources/inbrief-science-of-ece/" } },
          { day: "Tue", topic: "Sensitive Periods & Windows of Opportunity", activity: "Montessori sensitive periods chart", /*videoId: "IhcgYgx7aAA",*/ resource: { type: "Journal", title: "Montessori Northwest: Understanding Sensitive Periods in Toddlers", link: "https://montessorinorthwest.org/insights-blog" } },
          { day: "Wed", topic: "Role of Play in Brain Development", activity: "Play-based activity analysis worksheet", /* videoId: "6P7vA599_2Y",*/ resource: { type: "Journal", title: "American Academy of Pediatrics: The Power of Play", link: "https://publications.aap.org/pediatrics/article/142/3/e20182058/38644/The-Power-of-Play-A-Pediatric-Role-in-Enhancing" } },
          { day: "Thu", topic: "Stress & Toxic Stress in Children", activity: "Case study: recognizing trauma indicators", /* videoId: "rVwFkcOZHJw",*/ resource: { type: "Journal", title: "Harvard Center: Toxic Stress Explained", link: "https://developingchild.harvard.edu/science/key-concepts/toxic-stress/" } },
          { day: "Fri", topic: "Week Review & Reflection", activity: "Journal entry: key neuroscience insights for teaching", /* videoId: "bF3j5UVCSdM",*/ resource: { type: "News", title: "Psychology Today: How Early Trauma Shapes the Architecture of the Brain", link: "https://www.psychologytoday.com" } }
        ]
      },
      {
        week: 4, title: "Early Learning Theories",
        objectives: ["Compare Montessori, Piaget, Vygotsky & Reggio Emilia", "Apply constructivist principles in lesson design", "Identify the best-fit theory for Indian classrooms"],
        days: [
          { day: "Mon", topic: "Montessori Philosophy", activity: "Hands-on Montessori material exploration", /* videoId: "md0Nn_K8wE4",*/ resource: { type: "Journal", title: "Association Montessori Internationale (AMI) Principles", link: "https://montessori-ami.org" } },
          { day: "Tue", topic: "Piaget's Constructivism", activity: "Concrete → pictorial → abstract activity sequence", /* videoId: "Oxp_K8wE4y8",*/ resource: { type: "Journal", title: "Eric Digest: Constructivism in Early Childhood Education", link: "https://eric.ed.gov" } },
          { day: "Wed", topic: "Vygotsky's ZPD & Scaffolding", activity: "Scaffolded puzzle activity with peer support", /* videoId: "0XbhVj_Z8kI",*/ resource: { type: "Journal", title: "Vygotsky's Socio-Cultural Theory in Practice", link: "https://www.simplypsychology.org/vygotsky.html" } },
          { day: "Thu", topic: "Reggio Emilia Approach", activity: "Design a Reggio-inspired classroom environment plan", /* videoId: "788XU7WwG0M",*/ resource: { type: "News", title: "Edutopia: Why Reggio Emilia Environments Matter", link: "https://www.edutopia.org/article/reggio-emilia-approach" } },
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
          { day: "Mon", topic: "Structure of a Lesson Plan", activity: "Dissect 3 sample lesson plans – identify strengths", /* videoId: "h89G6K80_w8",*/ resource: { type: "Journal", title: "NCERT: National Curriculum Framework for Foundational Stage", link: "https://ncert.nic.in/pdf/NCF_for_Foundational_Stage_20_October_2022.pdf" } },
          { day: "Tue", topic: "SMART Objectives Writing", activity: "Convert vague goals into SMART objectives", /* videoId: "k88wG9X_8Ew",*/ resource: { type: "Journal", title: "Writing SMART Objectives in Early Childhood Systems", link: "https://ectacenter.org" } },
          { day: "Wed", topic: "Weekly Thematic Planning", activity: "Create a week-long 'Seasons' theme plan", /* videoId: "b98Gk7X99_Y",*/ resource: { type: "News", title: "Pre-K Pages: Organizing Thematic Units Productively", link: "https://www.pre-kpages.com" } },
          { day: "Thu", topic: "Age-Appropriate Activity Selection", activity: "Match activities to developmental stages", /* videoId: "0bM6w8X99Gk",*/ resource: { type: "Journal", title: "NAEYC: Developmentally Appropriate Practice (DAP)", link: "https://www.naeyc.org/resources/position-statements/dap" } },
          { day: "Fri", topic: "Download & Explore Lesson Plan Templates", activity: "Use SpacECE Lesson Plan files (all languages)", /* videoId: "kL89wG_7w88",*/ resource: { type: "Policy", title: "ECCE Curriculum Framework - Ministry of WCD India", link: "https://wcd.nic.in" } }
        ]
      },
      {
        week: 6, title: "Activity-Based Learning Design",
        objectives: ["Design sensory, cognitive, language & motor activities", "Understand free vs. structured play", "Create a balanced daily schedule"],
        days: [
          { day: "Mon", topic: "Sensory Play Activities", activity: "Sensory bin creation: sand, water, clay", /* videoId: "0b3M7pXG09o",*/ resource: { type: "Journal", title: "The Educational Value of Sensory Play", link: "https://www.goodstart.org.au" } },
          { day: "Tue", topic: "Cognitive & Problem-Solving Activities", activity: "Puzzle & sorting game design workshop", /* videoId: "v89Gk8X99_Y",*/ resource: { type: "News", title: "Scientific American: How Puzzles Boost Toddler Spatial Skills", link: "https://www.scientificamerican.com" } },
          { day: "Wed", topic: "Language Activities", activity: "Story bag and flannel board activity creation", /* videoId: "7S0Sly6vBwQ",*/ resource: { type: "Journal", title: "Reading Rockets: Story Maps and Flannel Boards", link: "https://www.readingrockets.org" } },
          { day: "Thu", topic: "Gross & Fine Motor Activities", activity: "Obstacle course + threading/lacing activity", /* videoId: "k3D0_FwS97k",*/ resource: { type: "Journal", title: "Fine Motor Skills Development Research Overview", link: "https://www.sciencedirect.com" } },
          { day: "Fri", topic: "Balancing Free & Structured Play", activity: "Create a balanced daily routine chart", /* videoId: "6P7vA599_2Y",*/ resource: { type: "Journal", title: "Unstructured Play vs Structured Play in ECE", link: "https://www.naeyc.org" } }
        ]
      },
      {
        week: 7, title: "Setting Up the Learning Environment",
        objectives: ["Design a safe, stimulating classroom layout", "Understand the importance of display and space", "Create inclusive spaces for all learners"],
        days: [
          { day: "Mon", topic: "Classroom Layout Principles", activity: "Floor plan design: classroom of 20 children", /* videoId: "788XU7WwG0M",*/ resource: { type: "Journal", title: "Designing Learner-Centered Spaces for Toddlers", link: "https://www.edutopia.org" } },
          { day: "Tue", topic: "Display & Print-Rich Environment", activity: "Create a bilingual word wall", /* videoId: "M2_H0Kup98I",*/ resource: { type: "News", title: "Edutopia: Setting Up a Print-Rich Classroom Environment", link: "https://www.edutopia.org" } },
          { day: "Wed", topic: "Learning Corners: Art & Science", activity: "Set up art corner with recycled materials", /* videoId: "h89G6K80_w8",*/ resource: { type: "Journal", title: "The Reggio Atelier: Setting Up Art Spaces", link: "https://www.reggiochildren.it" } },
          { day: "Thu", topic: "Reading & Block Corners", activity: "Curate age-appropriate book collection", /* videoId: "v89Gk8X99_Y",*/ resource: { type: "Journal", title: "NAEYC: Ten Things Children Learn in the Block Area", link: "https://www.naeyc.org" } },
          { day: "Fri", topic: "Outdoor Learning Spaces", activity: "Design outdoor activity station plan", /* videoId: "3m0VvC4wMhM",*/ resource: { type: "Journal", title: "Children & Nature Network Research Series", link: "https://www.childrenandnature.org" } }
        ]
      },
      {
        week: 8, title: "Scheduling & Routine Design",
        objectives: ["Understand the value of predictable routines", "Create transition strategies between activities", "Plan morning, midday & afternoon sessions"],
        days: [
          { day: "Mon", topic: "Importance of Routine for Young Children", activity: "Discuss: how routines build security and learning", /* videoId: "670gK6h89ks",*/ resource: { type: "Journal", title: "Zero to Three: Rountines and Emotional Grounding", link: "https://www.zerotothree.org" } },
          { day: "Tue", topic: "Morning Circle Time Planning", activity: "Script a 20-minute morning circle", /* videoId: "0XbhVj_Z8kI",*/ resource: { type: "News", title: "Pre-K Pages: Dynamic Circle Time Ideas", link: "https://www.pre-kpages.com" } },
          { day: "Wed", topic: "Transition Strategies", activity: "Create 5 transition songs/signals", /* videoId: "bF3j5UVCSdM",*/ resource: { type: "Journal", title: "NAEYC: Transition Activities that Work", link: "https://www.naeyc.org" } },
          { day: "Thu", topic: "Full Day Schedule Design", activity: "Build a 6-hour preschool timetable", /* videoId: "Oxp_K8wE4y8",*/ resource: { type: "Policy", title: "UNICEF: Standard Day Structures for Preschool Centres", link: "https://www.unicef.org" } },
          { day: "Fri", topic: "Month 2 Portfolio Review", activity: "Share lesson plan drafts for peer feedback", /* videoId: "L_M98pG87io",*/ resource: { type: "Journal", title: "Reflective Portfolios in Teacher Education", link: "https://eric.ed.gov" } }
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
          { day: "Mon", topic: "Oral Language Development", activity: "Puppetry and storytelling demonstration", /* videoId: "7S0Sly6vBwQ",*/ resource: { type: "Journal", title: "Reading Rockets: Developing Oral Language Skills", link: "https://www.readingrockets.org" } },
          { day: "Tue", topic: "Phonological Awareness & Phonics", activity: "Rhyme, alliteration & onset-rime games", /* videoId: "IhcgYgx7aAA",*/ resource: { type: "Journal", title: "Phonological Awareness vs Phonics Explained", link: "https://www.readingrockets.org" } },
          { day: "Wed", topic: "Emergent Reading Strategies", activity: "Shared reading with big books", /* videoId: "0b3M7pXG09o",*/ resource: { type: "News", title: "Edutopia: The Importance of Interactive Read-Alouds", link: "https://www.edutopia.org" } },
          { day: "Thu", topic: "Early Writing: Marks to Letters", activity: "Mark-making station with varied tools", /* videoId: "k3D0_FwS97k",*/ resource: { type: "Journal", title: "NAEYC: Learning to Write and Draw in Early Years", link: "https://www.naeyc.org" } },
          { day: "Fri", topic: "Multilingual Literacy", activity: "Bilingual story session using SpacECE Alphabet books", /* videoId: "L_M98pG87io",*/ resource: { type: "Policy", title: "NCERT Mother-Tongue Education Guidelines under NCF", link: "https://ncert.nic.in" } }
        ]
      },
      {
        week: 10, title: "Teaching Early Numeracy",
        objectives: ["Introduce pre-math concepts: number, pattern, shape, measurement", "Use hands-on materials for mathematical thinking", "Connect maths to everyday life"],
        days: [
          { day: "Mon", topic: "Number Sense & Counting", activity: "Count & sort objects; one-to-one correspondence", /* videoId: "md0Nn_K8wE4",*/ resource: { type: "Journal", title: "Erikson Institute: Early Math Collaborative", link: "https://earlymath.erikson.edu" } },
          { day: "Tue", topic: "Patterns & Sequencing", activity: "Bead threading & colour pattern activities", /* videoId: "7T08rU8c8gU",*/ resource: { type: "News", title: "The Atlantic: How Math Patterns Help Toddler Cognition", link: "https://www.theatlantic.com" } },
          { day: "Wed", topic: "Shapes & Spatial Awareness", activity: "Shape hunt around the classroom", /* videoId: "Oxp_K8wE4y8",*/ resource: { type: "Journal", title: "NCTM: Geometry and Spatial Sense in Early Childhood", link: "https://www.nctm.org" } },
          { day: "Thu", topic: "Measurement & Comparison", activity: "Compare lengths, weights using non-standard units", /* videoId: "M2_H0Kup98I",*/ resource: { type: "Journal", title: "Teaching Non-Standard Measurement to Preschoolers", link: "https://www.pre-kpages.com" } },
          { day: "Fri", topic: "Maths Through Play", activity: "Maths games station rotation (SpacECE curriculum books)", /* videoId: "6P7vA599_2Y",*/ resource: { type: "Journal", title: "Stanford DREME: Math Play Resources", link: "https://dreme.stanford.edu" } }
        ]
      },
      {
        week: 11, title: "STEM in Early Education",
        objectives: ["Design simple science investigations for young children", "Introduce basic technology concepts age-appropriately", "Foster curiosity, questioning & exploration"],
        days: [
          { day: "Mon", topic: "Science Through Senses", activity: "Sink/float, dissolve/not-dissolve experiments", /* videoId: "VNNsN9IJkws",*/ resource: { type: "Journal", title: "NSTA: Early Childhood Science Education Position Statement", link: "https://www.nsta.org" } },
          { day: "Tue", topic: "Observation & Inquiry Skills", activity: "Nature journal: draw and describe a leaf", /* videoId: "bF3j5UVCSdM",*/ resource: { type: "News", title: "Edutopia: Fostering Scientific Inquiry via Play", link: "https://www.edutopia.org" } },
          { day: "Wed", topic: "Simple Engineering Challenges", activity: "Build a bridge from paper and sticks", /* videoId: "0XbhVj_Z8kI",*/ resource: { type: "Journal", title: "STEM Engineering Frameworks for Kindergarten", link: "https://eric.ed.gov" } },
          { day: "Thu", topic: "Tech Literacy for Young Children", activity: "Introduce safe digital tools for learning", /* videoId: "670gK6h89ks",*/ resource: { type: "Journal", title: "NAEYC: Technology and Interactive Media in ECE", link: "https://www.naeyc.org" } },
          { day: "Fri", topic: "STEM Integration in Theme Planning", activity: "Redesign a lesson plan with STEM lens", /* videoId: "3m0VvC4wMhM",*/ resource: { type: "Journal", title: "The STEM Shift in Foundational Classrooms", link: "https://www.sciencedirect.com" } }
        ]
      },
      {
        week: 12, title: "Creative Arts in Early Learning",
        objectives: ["Use art, music, dance & drama as learning tools", "Encourage imagination and process-over-product", "Connect creative arts to other curriculum areas"],
        days: [
          { day: "Mon", topic: "Visual Arts: Drawing & Painting", activity: "Process art session: free painting", /* videoId: "788XU7WwG0M",*/ resource: { type: "Journal", title: "Process Art vs Product Art in Child Development", link: "https://www.naeyc.org" } },
          { day: "Tue", topic: "Music & Movement", activity: "Action songs and rhythm instruments", /* videoId: "h89G6K80_w8",*/ resource: { type: "News", title: "BBC: How Music Beats Boost Early Language Skills", link: "https://www.bbc.com/news" } },
          { day: "Wed", topic: "Drama & Role Play", activity: "Dress-up corner + scenario cards", /* videoId: "v89Gk8X99_Y",*/ resource: { type: "Journal", title: "The Power of Dramatic Play in Preschool", link: "https://www.pre-kpages.com" } },
          { day: "Thu", topic: "Dance & Body Awareness", activity: "Moving to music: fast, slow, high, low", /* videoId: "NezqZ8vR0o8",*/ resource: { type: "Journal", title: "Kinesthetic Learning and Vestibular Balance for Kids", link: "https://www.zerotothree.org" } },
          { day: "Fri", topic: "Month 3 Micro-Teaching", activity: "Each trainee teaches a 10-min creative arts activity", /* videoId: "0bM6w8X99Gk",*/ resource: { type: "Journal", title: "Micro-teaching Formative Models for Educators", link: "https://eric.ed.gov" } }
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
          { day: "Mon", topic: "Why Observe? Purpose of Assessment in ECE", activity: "Discuss: observation vs. judgment", /* videoId: "IhcgYgx7aAA",*/ resource: { type: "Journal", title: "NAEYC: Observing and Documenting Child Development", link: "https://www.naeyc.org" } },
          { day: "Tue", topic: "Anecdotal Records", activity: "Practice writing objective anecdotal notes", /* videoId: "k3D0_FwS97k",*/ resource: { type: "News", title: "HighScope: Objective vs Subjective Observations", link: "https://highscope.org" } },
          { day: "Wed", topic: "Running Records & Checklists", activity: "Use SpacECE Field Work Tracker (Months 1–3)", /* videoId: "7S0Sly6vBwQ",*/ resource: { type: "Journal", title: "Using Running Records to Assess Emergent Literacy", link: "https://www.readingrockets.org" } },
          { day: "Thu", topic: "Building a Child Portfolio", activity: "Collect work samples + photos for mock portfolio", /* videoId: "md0Nn_K8wE4",*/ resource: { type: "Journal", title: "Authentic Portfolios in Early Learning Centers", link: "https://eric.ed.gov" } },
          { day: "Fri", topic: "Digital Documentation Tools", activity: "Explore safe photo-sharing & documentation apps", /* videoId: "L_M98pG87io",*/ resource: { type: "Journal", title: "Privacy Protocols for Classroom Digital Documentation", link: "https://www.unicef.org" } }
        ]
      },
      {
        week: 14, title: "Developmental Assessment Tools",
        objectives: ["Administer cognitive, motor & social-emotional assessments", "Interpret results without labelling children", "Use SpacECE Field Work Tracker (4–6 months)"],
        days: [
          { day: "Mon", topic: "Types of Assessment: Formative vs. Summative", activity: "Compare approaches with case examples", /* videoId: "670gK6h89ks",*/ resource: { type: "Journal", title: "Formative Assessment Methods in Kindergarten", link: "https://www.edutopia.org" } },
          { day: "Tue", topic: "Cognitive & Language Assessment Tools", activity: "Administer a sample language screener", /* videoId: "6P7vA599_2Y",*/ resource: { type: "Journal", title: "ASQ-3 Developmental Screening Tools Overview", link: "https://agesandstages.com" } },
          { day: "Wed", topic: "Motor Skills Assessment", activity: "Gross & fine motor checklist: peer practice", /* videoId: "7T08rU8c8gU",*/ resource: { type: "Journal", title: "Peabody Developmental Motor Scales (PDMS) Structure", link: "https://www.sciencedirect.com" } },
          { day: "Thu", topic: "Social-Emotional Assessment", activity: "Use temperament & social skills observation rubric", /* videoId: "VNNsN9IJkws",*/ resource: { type: "Journal", title: "DECA Assessment for Resiliency and Emotional Health", link: "https://www.centerforresilientchildren.org" } },
          { day: "Fri", topic: "Reporting to Parents", activity: "Write a sample parent progress report", /* videoId: "0b3M7pXG09o",*/ resource: { type: "News", title: "The Guardian: Revolutionizing the Preschool Report Card", link: "https://www.theguardian.com" } }
        ]
      },
      {
        week: 15, title: "Positive Discipline & Behavior Guidance",
        objectives: ["Set clear, consistent classroom rules", "Use positive reinforcement strategies", "Manage challenging behaviors compassionately"],
        days: [
          { day: "Mon", topic: "Understanding Behavior as Communication", activity: "Case study: decoding a child's challenging behavior", /* videoId: "rVwFkcOZHJw",*/ resource: { type: "Journal", title: "Center on the Social Emotional Foundations for Early Learning (CSEFEL)", link: "https://vanderbilt.edu/csefel" } },
          { day: "Tue", topic: "Setting Rules & Boundaries", activity: "Co-create classroom rules with children (role-play)", /* videoId: "0XbhVj_Z8kI",*/ resource: { type: "News", title: "Edutopia: Co-creating Rules with Four Year Olds", link: "https://www.edutopia.org" } },
          { day: "Wed", topic: "Positive Reinforcement Techniques", activity: "Reward systems: stickers, star charts, praise", /* videoId: "bF3j3UVCSdM",*/ resource: { type: "Journal", title: "The Pitfalls of Token Economies vs Descriptive Praise", link: "https://www.naeyc.org" } },
          { day: "Thu", topic: "De-escalation Strategies", activity: "Practice calm-down corner setup and scripts", /* videoId: "Oxp_K8wE4y8",*/ resource: { type: "Journal", title: "Setting Up a Conscious Discipline Calm Down Corner", link: "https://consciousdiscipline.com" } },
          { day: "Fri", topic: "Social Skills Building", activity: "Conflict resolution role-play scenarios", /* videoId: "M2_H0Kup98I",*/ resource: { type: "Journal", title: "Teaching Peace in Preschool: Peer Dispute Resolutions", link: "https://www.zerotothree.org" } }
        ]
      },
      {
        week: 16, title: "Inclusive Education & Diversity",
        objectives: ["Support children with special learning needs", "Celebrate cultural diversity in the classroom", "Adapt activities for all learners"],
        days: [
          { day: "Mon", topic: "Principles of Inclusive Education", activity: "Watch & discuss: inclusion short film", /* videoId: "788XU7WwG0M",*/ resource: { type: "Journal", title: "UNICEF: Right to Education for Children with Disabilities", link: "https://www.unicef.org" } },
          { day: "Tue", topic: "Identifying Special Learning Needs", activity: "Red flag indicators checklist exercise", /* videoId: "NezqZ8vR0o8",*/ resource: { type: "Policy", title: "RPWD Act 2016 Guidelines for Indian Educational Institutions", link: "https://disabilityaffairs.gov.in" } },
          { day: "Wed", topic: "Adapting Activities for Inclusion", activity: "Modify 3 activities for diverse learners", /* videoId: "0bM6w8X99Gk",*/ resource: { type: "Journal", title: "Head Start: Universal Design for Learning (UDL) in ECE", link: "https://eclkc.ohs.acf.hhs.gov" } },
          { day: "Thu", topic: "Celebrating Cultural Diversity", activity: "Design a multicultural classroom calendar", /* videoId: "3m0VvC4wMhM",*/ resource: { type: "News", title: "Edutopia: Moving Beyond Anti-Bias Tourism in Curriculum", link: "https://www.edutopia.org" } },
          { day: "Fri", topic: "Month 4 Assessment", activity: "Mock assessment: observe child video + write report", /* videoId: "v89Gk8X99_Y",*/ resource: { type: "Journal", title: "Diagnostic Accuracy in Early Screening Instruments", link: "https://eric.ed.gov" } }
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
          { day: "Mon", topic: "Importance of Family Engagement", activity: "Research: impact of parent involvement on learning", /* videoId: "670gK6h89ks",*/ resource: { type: "Journal", title: "Harvard Family Research Project ECE Matrix", link: "https://globalfrp.org" } },
          { day: "Tue", topic: "Parent-Teacher Conference Skills", activity: "Role-play: delivering difficult feedback sensitively", /* videoId: "IhcgYgx7aAA",*/ resource: { type: "News", title: "Edutopia: Navigating Tough Conversations with Parents", link: "https://www.edutopia.org" } },
          { day: "Wed", topic: "Activity Calendars & Newsletters", activity: "Design a monthly family newsletter", /* videoId: "7S0Sly6vBwQ",*/ resource: { type: "Journal", title: "Effective Print and Electronic Communiques for Working Families", link: "https://www.naeyc.org" } },
          { day: "Thu", topic: "Parent Workshops", activity: "Plan a 1-hour parenting workshop on play at home", /* videoId: "md0Nn_K8wE4",*/ resource: { type: "Journal", title: "WHO: Care for Child Development Framework", link: "https://www.who.int" } },
          { day: "Fri", topic: "Parents Capacity Building Materials", activity: "Review SpacECE Parents Capacity Building resource", /* videoId: "L_M98pG87io",*/ resource: { type: "Policy", title: "Ministry of Education: NIPUN Bharat Parent Guidelines", link: "https://www.education.gov.in" } }
        ]
      },
      {
        week: 18, title: "Community Engagement & Advocacy",
        objectives: ["Leverage local resources for enriched learning", "Advocate for early childhood education", "Build a network of support for families"],
        days: [
          { day: "Mon", topic: "The Community as a Classroom", activity: "Map community resources relevant to ECE", /* videoId: "6P7vA599_2Y",*/ resource: { type: "Journal", title: "Place-Based Education Models in Foundational Learning", link: "https://eric.ed.gov" } },
          { day: "Tue", topic: "Inviting Community Helpers", activity: "Plan a 'Community Helpers Week'", /* videoId: "k3D0_FwS97k",*/ resource: { type: "News", title: "The Times of India: Revving Up Civic Awareness in Pre-schools", link: "https://timesofindia.indiatimes.com" } },
          { day: "Wed", topic: "Local Culture in the Curriculum", activity: "Incorporate local festivals & traditions in lesson plans", /* videoId: "Oxp_K8wE4y8",*/ resource: { type: "Journal", title: "Culturally Responsive Pedagogy in Early Childhood Settings", link: "https://www.naeyc.org" } },
          { day: "Thu", topic: "Advocacy for ECE", activity: "Write a short advocacy letter to a local official", /* videoId: "VNNsN9IJkws",*/ resource: { type: "Journal", title: "NAEYC: Becoming an Early Childhood Advocate", link: "https://www.naeyc.org" } },
          { day: "Fri", topic: "Networking & Professional Learning", activity: "Explore MOOCs, webinars, and ECE groups", /* videoId: "3m0VvC4wMhM",*/ resource: { type: "Journal", title: "The Power of Professional Learning Communities (PLCs) in ECE", link: "https://www.edutopia.org" } }
        ]
      },
      {
        week: 19, title: "Child Health, Safety & Nutrition",
        objectives: ["Implement child safety and safeguarding protocols", "Teach hygiene habits to young children", "Plan nutritious snack and meal activities"],
        days: [
          { day: "Mon", topic: "Child Protection & Safeguarding", activity: "Recognize indicators of abuse: case study", /* videoId: "rVwFkcOZHJw",*/ resource: { type: "Policy", title: "POCSO Act 2012 Mandatory Reporting Guidelines for Teachers", link: "https://wcd.nic.in" } },
          { day: "Tue", topic: "Emergency Preparedness & First Aid", activity: "Basic first aid demonstration: cuts, choking", /* videoId: "7T08rU8c8gU",*/ resource: { type: "Journal", title: "Red Cross: Pediatric First Aid and CPR Basics", link: "https://www.redcross.org" } },
          { day: "Wed", topic: "Teaching Hygiene to Children", activity: "Create a hand-washing song and poster", /* videoId: "0b3M7pXG09o",*/ resource: { type: "News", title: "UNICEF: Handwashing Campaigns in Early Learning Centers", link: "https://www.unicef.org" } },
          { day: "Thu", topic: "Nutrition Basics for Early Childhood", activity: "Design a balanced weekly snack plan", /* videoId: "M2_H0Kup98I",*/ resource: { type: "Journal", title: "ICMR: Dietary Guidelines for Indian Children under 5", link: "https://www.nin.res.in" } },
          { day: "Fri", topic: "Physical Activity & Fitness", activity: "Plan 5 outdoor movement activities", /* videoId: "0XbhVj_Z8kI",*/ resource: { type: "Journal", title: "SHAPE America: Active Start Physical Guidelines", link: "https://www.shapeamerica.org" } }
        ]
      },
      {
        week: 20, title: "Reflective Teaching & Professional Ethics",
        objectives: ["Practice self-evaluation and peer feedback", "Understand ethics and professionalism in ECE", "Begin building a professional portfolio"],
        days: [
          { day: "Mon", topic: "What is Reflective Teaching?", activity: "Start a reflective teaching journal", /* videoId: "bF3j5UVCSdM",*/ resource: { type: "Journal", title: "Dewey's Models of Reflective Action in Pedagogy", link: "https://eric.ed.gov" } },
          { day: "Tue", topic: "Self-Evaluation Frameworks", activity: "Use a teaching reflection rubric on a recorded lesson", /* videoId: "h89G6K80_w8",*/ resource: { type: "News", title: "Edutopia: The Value of Filming Yourself Teaching", link: "https://www.edutopia.org" } },
          { day: "Wed", topic: "Peer Observation & Feedback", activity: "Observe a peer and give structured feedback", /* videoId: "v89Gk8X99_Y",*/ resource: { type: "Journal", title: "Critical Friends Groups Protocol in Early Years Training", link: "https://www.naeyc.org" } },
          { day: "Thu", topic: "Ethics & Professionalism in ECE", activity: "Discuss ethical dilemmas: case studies", /* videoId: "NezqZ8vR0o8",*/ resource: { type: "Journal", title: "NAEYC Code of Ethical Conduct Position Statement", link: "https://www.naeyc.org/resources/position-statements/ethical-conduct" } },
          { day: "Fri", topic: "Building Your Professional Portfolio", activity: "Compile Month 1–5 work into portfolio framework", /* videoId: "0bM6w8X99Gk",*/ resource: { type: "Journal", title: "Digital Portfolios as Artifacts of Professional Mastery", link: "https://eric.ed.gov" } }
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
          { day: "Mon", topic: "Practicum Orientation & Guidelines", activity: "Review SpacECE Field Work Tracker (4–6 Months)", /* videoId: "L_M98pG87io",*/ resource: { type: "Journal", title: "Standard Field Placement Trackers for Student Teachers", link: "https://eric.ed.gov" } },
          { day: "Tue", topic: "Classroom Observation Visit 1", activity: "Shadow an experienced preschool teacher", /* videoId: "788XU7WwG0M",*/ resource: { type: "News", title: "Edutopia: What to Look for When Observing a Master Teacher", link: "https://www.edutopia.org" } },
          { day: "Wed", topic: "Post-Observation Debrief", activity: "Write observation report using anecdotal format", /* videoId: "IhcgYgx7aAA",*/ resource: { type: "Journal", title: "Transforming Student Teacher Reflections post Field Visits", link: "https://www.naeyc.org" } },
          { day: "Thu", topic: "Classroom Observation Visit 2", activity: "Focus on transitions and behavior guidance", /* videoId: "rVwFkcOZHJw",*/ resource: { type: "Journal", title: "Evaluating Dynamic Transition Efficiencies in Real-time", link: "https://highscope.org" } },
          { day: "Fri", topic: "Personal Teaching Goal Setting", activity: "Write SMART goals for teaching practice", /* videoId: "k3D0_FwS97k",*/ resource: { type: "Journal", title: "Goal-Oriented Action Plans for Practicum Cohorts", link: "https://eric.ed.gov" } }
        ]
      },
      {
        week: 22, title: "Micro-Teaching Practice Sessions",
        objectives: ["Deliver 3 micro-teaching lessons (15 min each)", "Receive and apply mentor feedback", "Refine lesson planning and delivery skills"],
        days: [
          { day: "Mon", topic: "Micro-Teaching Session 1: Language Activity", activity: "Teach a story + phonics mini-lesson to peers", /* videoId: "7S0Sly6vBwQ",*/ resource: { type: "Journal", title: "Peer-to-Peer Micro-lessons in Foundational Literacy", link: "https://www.readingrockets.org" } },
          { day: "Tue", topic: "Feedback & Reflection on Session 1", activity: "Mentor debrief using structured feedback form", /* videoId: "0b3M7pXG09o",*/ resource: { type: "Journal", title: "The Clinical Feedback Loop in Alternative Teacher Credentials", link: "https://eric.ed.gov" } },
          { day: "Wed", topic: "Micro-Teaching Session 2: Math Activity", activity: "Teach a counting/patterning game to peers", /* videoId: "md0Nn_K8wE4",*/ resource: { type: "Journal", title: "Analyzing Conceptual Errors in Peer Maths Delivery", link: "https://earlymath.erikson.edu" } },
          { day: "Thu", topic: "Feedback & Reflection on Session 2", activity: "Self-evaluate using video playback", /* videoId: "h89G6K80_w8",*/ resource: { type: "News", title: "Edutopia: Video Self-Modeling for Professional Mastery", link: "https://www.edutopia.org" } },
          { day: "Fri", topic: "Micro-Teaching Session 3: Creative Arts", activity: "Teach a music or movement activity to peers", /* videoId: "6P7vA599_2Y",*/ resource: { type: "Journal", title: "Assessing Facilitation Confidence in Performing Arts Lessons", link: "https://www.naeyc.org" } }
        ]
      },
      {
        week: 23, title: "Capstone Project Development",
        objectives: ["Design and implement a 3-day thematic unit plan", "Document with photos, samples & reflections", "Present to a panel for assessment"],
        days: [
          { day: "Mon", topic: "Capstone Project Brief & Expectations", activity: "Choose theme + draft unit plan outline", /* videoId: "3m0VvC4wMhM",*/ resource: { type: "Journal", title: "Thematic Project Approach in Early Childhood Capstones", link: "https://projectapproach.org" } },
          { day: "Tue", topic: "Develop Full 3-Day Unit Plan", activity: "Write detailed plans for 3 consecutive teaching days", /* videoId: "0XbhVj_Z8kI",*/ resource: { type: "Journal", title: "Scaffolding Long-Term Thematic Unit Progressions", link: "https://ncert.nic.in" } },
          { day: "Wed", topic: "Resource Preparation for Capstone", activity: "Create all materials, visual aids and activities", /* videoId: "M2_H0Kup98I",*/ resource: { type: "News", title: "Pre-K Pages: DIY Classroom Props with Nil Cost Materials", link: "https://www.pre-kpages.com" } },
          { day: "Thu", topic: "Teach Capstone Unit Day 1 & 2", activity: "Deliver in real preschool or simulated classroom", /* videoId: "Oxp_K8wE4y8",*/ resource: { type: "Journal", title: "Field Practicum Execution Indicators: A Clinical Rubric", link: "https://eric.ed.gov" } },
          { day: "Fri", topic: "Teach Capstone Unit Day 3 & Documentation", activity: "Final teaching day + collect evidence for portfolio", /* videoId: "bF3j5UVCSdM",*/ resource: { type: "Journal", title: "Assembling Final Pedagogical Evidence Frameworks", link: "https://www.naeyc.org" } }
        ]
      },
      {
        week: 24, title: "Portfolio Completion & Certification",
        objectives: ["Finalize professional teaching portfolio", "Sit for final written and practical assessment", "Graduate and receive SpacECE certification"],
        days: [
          { day: "Mon", topic: "Portfolio Compilation & Review", activity: "Final portfolio check: all sections complete?", /* videoId: "v89Gk8X99_Y",*/ resource: { type: "Journal", title: "Professional Standards Review for Graduating ECE Specialists", link: "https://www.naeyc.org" } },
          { day: "Tue", topic: "Capstone Project Presentation", activity: "Present 10-minute project summary to panel", /* videoId: "NezqZ8vR0o8",*/ resource: { type: "News", title: "Edutopia: Elevating Defense Panels in Teacher Preparation", link: "https://www.edutopia.org" } },
          { day: "Wed", topic: "Written Final Assessment", activity: "Comprehensive written exam on all 6 months", /* videoId: "670gK6h89ks",*/ resource: { type: "Journal", title: "Psychometric Testing Formats for Early Pedagogy Competencies", link: "https://eric.ed.gov" } },
          { day: "Thu", topic: "Practical Assessment", activity: "Teach a 20-min lesson evaluated by mentor panel", /* videoId: "0bM6w8X99Gk",*/ resource: { type: "Journal", title: "The Danielson Framework for Assessing Classroom Instructors", link: "https://danielsongroup.org" } },
          { day: "Fri", topic: "Graduation & Certification Ceremony", activity: "Award of SpacECE Certificate + career guidance session", /* videoId: "7T08rU8c8gU",*/ resource: { type: "Policy", title: "National Council for Teacher Education (NCTE) Career Guidelines", link: "https://ncte.gov.in" } }
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
  grid.innerHTML = COURSES_DATA.map((c, i) => `
    <div class="card course-card fade-in">
      <div class="course-thumb">
        <img src="${c.img}" alt="${c.title}" loading="lazy">
        <span class="course-duration"><i class="far fa-clock"></i> ${c.duration}</span>
        <button class="course-play-btn" onclick="openCoursePreview(${i})" title="Preview Course">
          <i class="fas fa-play"></i>
        </button>
      </div>
      <div class="course-body">
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="course-highlights">
          ${c.highlights.map(h => `<span class="highlight-tag"><i class="fas fa-check"></i> ${h}</span>`).join('')}
        </div>
      </div>
      <div class="course-footer">
        <button class="btn btn-outline btn-sm" onclick="openCoursePreview(${i})">
          <i class="fab fa-youtube"></i> Preview
        </button>
        <button class="btn btn-primary btn-sm" onclick="navigate('contact')">Enquire Now</button>
      </div>
    </div>
  `).join('');
}

function openCoursePreview(index) {
  const c = COURSES_DATA[index];
  const modal     = document.getElementById('course-preview-modal');
  const titleEl   = document.getElementById('cpm-title');
  const durEl     = document.getElementById('cpm-duration');
  const descEl    = document.getElementById('cpm-desc');
  const hlEl      = document.getElementById('cpm-highlights');
  //const iframe    = document.getElementById('cpm-iframe');

  titleEl.textContent = c.title;
  durEl.textContent   = c.duration;
  descEl.textContent  = c.desc;
  hlEl.innerHTML = c.highlights.map(h =>
    `<div class="cpm-highlight"><i class="fas fa-check-circle"></i> ${h}</div>`
  ).join('');
  //iframe.src = `https://www.youtube.com/embed/${c.videoId}?autoplay=1&rel=0`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCoursePreview() {
  const modal  = document.getElementById('course-preview-modal');
  //const iframe = document.getElementById('cpm-iframe');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  //iframe.src = '';
}

function initCoursePreviewModal() {
  const modal = document.createElement('div');
  modal.id = 'course-preview-modal';
  modal.innerHTML = `
    <div class="cpm-backdrop" id="cpm-backdrop"></div>
    <div class="cpm-box">
      <button class="cpm-close" onclick="closeCoursePreview()" title="Close">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="cpm-info">
        <div class="cpm-badge"><i class="far fa-clock"></i> <span id="cpm-duration"></span></div>
        <h3 id="cpm-title"></h3>
        <p id="cpm-desc"></p>
        <div id="cpm-highlights" class="cpm-highlights-grid"></div>
        <div class="cpm-actions">
          <button class="btn btn-primary" onclick="navigate('contact'); closeCoursePreview();">
            <i class="fas fa-paper-plane"></i> Apply Now
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cpm-backdrop').addEventListener('click', closeCoursePreview);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCoursePreview(); });
}

function openDayPreview(d) {
  if (!document.getElementById('day-preview-modal')) initDayPreviewModal();
  document.getElementById('dpm-duration').textContent = d.day;
  document.getElementById('dpm-title').textContent    = d.topic;
  document.getElementById('dpm-desc').textContent     = d.activity;
  document.getElementById('dpm-highlights').innerHTML = '';
  document.getElementById('dpm-iframe').src = d.videoId
    ? 'https://www.youtube.com/embed/' + d.videoId + '?rel=0' : '';
  document.getElementById('day-preview-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDayPreview() {
  document.getElementById('day-preview-modal').classList.remove('open');
  document.getElementById('dpm-iframe').src = '';
  document.body.style.overflow = '';
}
function initDayPreviewModal() {
  const modal = document.createElement('div');
  modal.id = 'day-preview-modal';
  modal.innerHTML = `
    <div class="cpm-backdrop" id="dpm-backdrop"></div>
    <div class="cpm-box">
      <button class="cpm-close" onclick="closeDayPreview()" title="Close">
        <i class="fas fa-times"></i>
      </button>
      <div class="cpm-video-wrap">
        <iframe id="dpm-iframe" src="" allowfullscreen
          allow="autoplay; encrypted-media; picture-in-picture" frameborder="0"></iframe>
      </div>
      
      <div class="cpm-info">
        <div class="cpm-badge"><i class="fas fa-calendar-day"></i> <span id="dpm-duration"></span></div>
        <h3 id="dpm-title"></h3>
        <p id="dpm-desc"></p>
        <div id="dpm-highlights" class="cpm-highlights-grid"></div>
        <div class="cpm-actions">
          <button class="btn btn-primary" onclick="navigate('contact'); closeDayPreview();">
            <i class="fas fa-paper-plane"></i> Apply Now
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('dpm-backdrop').addEventListener('click', closeDayPreview);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDayPreview(); });
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
        <div class="station-link">

          <!-- Facebook Resource Indicator -->
          <i class="fab fa-facebook"
             style="color:#1877F2;font-size:14px;"></i>

          <span>${l.label}</span>

          <!-- Open in Same Tab -->
          <a href="${l.url}"
             class="same-tab-link"
             title="Open in Same Tab">
            <i class="fas fa-play-circle"
               style="color:#22c55e;font-size:15px;"></i>
          </a>

          <!-- Open in New Tab -->
          <a href="${l.url}"
             target="_blank"
             rel="noopener noreferrer"
             class="new-tab-link"
             title="Open in New Tab">
            <i class="fas fa-external-link-alt"
               style="font-size:12px;color:var(--muted);"></i>
          </a>

        </div>
      `).join('')}
    </div>
  </div>
`).join('');
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

  initCoursePreviewModal();
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