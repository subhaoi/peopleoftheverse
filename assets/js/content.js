/* ==========================================================
   People of the Verse — CONTENT
   Everything on the site that is "a fact" lives in this file.
   Edit `live` to fill the placeholders with the real thing.
   `sample` is a clearly-fake data set the team can switch on
   from the Playground panel, to see the design with real-
   looking content. Neither is published as truth.

   Photos: put images in assets/img/ and set e.g.
   photo: 'assets/img/team-01.jpg'. Empty = placeholder tile.
   ========================================================== */

(function () {
  const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i));

  /* Questions on the FAQ page. Answers that need a real fact come from `visit`. */
  const faqPage = (v) => [
    { q: 'Is it really free?', a: 'Yes. Entry to every reading is free. Fundraiser shows invite donations for the cause, and giving is always optional.' },
    { q: 'Do I need to RSVP?', a: v.rsvp },
    { q: 'Can I come on my own?', a: 'Yes, you are welcome to come alone. The room is built around listening to each other.' },
    { q: 'Do I have to perform to come along?', a: 'No. Come to listen, cheer and be part of the room.' },
    { q: 'What kind of poems will I hear?', a: 'A mix of voices and styles. Each month we pick the line-up for quality of writing, authenticity, new and refreshing perspectives, respect for everyone, and an insatiable love for poetry.' },
    { q: 'Can I take photos or record?', a: v.photos },
    { q: 'Can I read my own poem?', a: 'Yes, through a Spot Slot. Put a slip in before the show, and two names are drawn from the audience box at the reading. Full details are on the Perform page.' },
    { q: 'What if something feels wrong?', a: 'Tell a host and we will help. Our code of conduct is on the About page. ' + v.help }
  ];
  const liveVisit = {
    doors: '[WHEN DOORS OPEN AND WHERE TO CHECK IN]',
    after: '[WHAT HAPPENS AFTER THE READING]',
    time: '[START AND END TIME OF A READING]',
    getting: '[HOW TO GET TO THE VENUE BY METRO OR BUS AND WHERE TO PARK]',
    language: '[LANGUAGES USED AT READINGS]',
    seating: '[SEATING AT THE VENUE]',
    kids: '[WHETHER CHILDREN ARE WELCOME AND ANY AGE NOTE]',
    access: '[STEP FREE ENTRY, LIFTS, RESTROOMS AND ACCESSIBLE SEATING]',
    food: '[FOOD AND DRINK AT THE VENUE]',
    rsvp: '[WHETHER YOU NEED TO RSVP]',
    photos: '[PHOTO AND RECORDING POLICY]',
    help: '[WHO TO TELL AT THE EVENT IF SOMETHING FEELS WRONG]'
  };
  const sampleVisit = {
    doors: 'Doors open at 4:00 PM. Say hello at the entrance and find a seat.',
    after: 'Sample text: stay for a chat with the poets over tea.',
    time: '4:30 PM to about 7:00 PM',
    getting: 'Sample text: 5 minutes from the nearest metro station. Street parking nearby.',
    language: 'Mostly English, with the occasional word or line in another language.',
    seating: 'Sample text: chairs at the front, floor cushions at the back.',
    kids: 'Sample text: kids over 12 are welcome with an adult.',
    access: 'Sample text: step-free entry, a lift and an accessible restroom.',
    food: 'Sample text: tea and snacks are available at the venue.',
    rsvp: 'Sample text: no RSVP needed, just walk in.',
    photos: 'Sample text: please ask a host before recording a poet.',
    help: 'Sample text: find a host in a PoV tee, or message us on Instagram.'
  };
  const liveAbout = {
    since: '[YEAR STARTED]',
    readings: '[READINGS]',
    poets: '[POETS]',
    why: '[HOW AND WHY POV STARTED]',
    who: '[WHO STARTED IT AND WHEN]',
    moment: '[A MOMENT OR READING THAT SHAPED THE COLLECTIVE]',
    feel: '[WHAT THE ROOM FEELS LIKE]',
    crowd: '[HOW MANY PEOPLE USUALLY COME]'
  };
  const sampleAbout = {
    since: '2025',
    readings: '10',
    poets: '64',
    why: 'Sample text: it began with a handful of friends who wanted a room where poetry could be heard properly.',
    who: 'Sample text: started by a few poets and listeners in Bangalore.',
    moment: 'Sample text: one night, a first-time reader got a standing ovation, and we knew what the room was for.',
    feel: 'Sample text: warm, hushed during a poem, loud when it ends.',
    crowd: 'around 50 people on a good evening.'
  };

  window.POV_CONTENT = {

    config: {
      // Set to false before going public to hide the Playground button.
      playground: true
    },

    /* ---------------- LIVE (fill these in) ---------------- */
    live: {
      visit: liveVisit,
      about: liveAbout,
      faqPage: faqPage(liveVisit),
      links: {
        instagram: 'https://www.instagram.com/people_of_the_verse/',
        youtube: https://www.youtube.com/@people_of_the_verse',                 // add when the channel exists
        feedback: '#',                // where the footer QR code should point
        email: 'peopleoftheverses@gmail.com'
      },
      next: {
        date: '[DAY, DATE]',
        time: '[TIME]',
        venue: '[VENUE NAME]',
        area: '[AREA]',
        feature: '[FEATURE POET]',
        featureLong: '[FEATURE POET NAME]',
        rsvp: '#'
      },
      poets: rep(7, () => '[POET NAME]'),
      past: rep(8, () => ({ name: '[EVENT NAME]', date: '[MONTH YEAR]', photo: '', link: '#' })),
      fund: {
        total: '[TOTAL]',
        count: '[N]',
        why: '[A SHORT NOTE ON WHY THIS CAUSE WAS CHOSEN FOR THE SHOW]',
        latest: {
          name: '[BENEFICIARY NAME]',
          blurb: '[ONE LINE ON WHO THEY ARE AND WHAT THE SHOW SUPPORTED]',
          event: '[EVENT NAME]',
          amount: '[AMOUNT]',
          donate: '#'
        },
        past: rep(6, () => ({ month: '[MONTH YEAR]', name: '[BENEFICIARY NAME]', blurb: '[ONE LINE ON THE CAUSE]', amount: '[AMOUNT]', donate: '#' })),
        how: {
          choose: '[HOW A BENEFICIARY IS CHOSEN FOR EACH SHOW]',
          money: '[HOW DONATIONS REACH THE BENEFICIARY]',
          share: '[WHERE THE AMOUNTS RAISED ARE PUBLISHED]'
        }
      },
      mag: {
        latest: { no: '[NO.]', month: '[MONTH YEAR]', cover: '[COVER LINE FOR THE LATEST ISSUE]', link: '#' },
        past: rep(8, () => ({ no: '[NO.]', month: '[MONTH YEAR]', theme: '[THEME]', link: '#' })),
        submit: {
          dates: '[SUBMISSION DATES]',
          theme: '[THEME FOR THE NEXT ISSUE]',
          limit: '[WORD OR LINE LIMIT]',
          after: '[WHAT HAPPENS NEXT AND WHEN YOU WILL HEAR BACK]'
        }
      },
      team: rep(8, () => ({ name: '[NAME]', role: '[ROLE]', line: '[ONE LINE ABOUT THEM]', photo: '' })),
      notes: [
        '[WHAT YOU SAID ON THE FEEDBACK FORM]',
        '[ANOTHER LINE FROM THE ROOM]',
        '[A THIRD NOTE, IN THEIR WORDS]'
      ],
      wall: [
        { lines: ['the city', 'holds its breath', 'we listen'], by: '[VISITOR NAME]' },
        { lines: ['say it slow', 'hands open', 'show up'], by: '[VISITOR NAME]' },
        { lines: ['quiet room', 'loud heart', 'again tonight'], by: '[VISITOR NAME]' }
      ]
    },

    /* ---------------- SAMPLE (clearly fake demo data) ---------------- */
    sample: {
      visit: sampleVisit,
      about: sampleAbout,
      faqPage: faqPage(sampleVisit),
      links: {
        instagram: 'https://www.instagram.com/people_of_the_verse/',
        youtube: '#',
        feedback: '#',
        email: 'hello@example.com'
      },
      next: {
        date: 'Sat, 15 Nov',
        time: '6:00 PM',
        venue: 'Sample Venue',
        area: 'Sample Area',
        feature: 'Sample Feature Poet',
        featureLong: 'Sample Feature Poet',
        rsvp: '#'
      },
      poets: ['Poet One', 'Poet Two', 'Poet Three', 'Poet Four', 'Poet Five', 'Poet Six', 'Poet Seven'],
      past: ['Sample Reading One', 'Sample Reading Two', 'Sample Reading Three', 'Sample Reading Four', 'Sample Reading Five', 'Sample Reading Six', 'Sample Reading Seven', 'Sample Reading Eight']
        .map((n, i) => ({ name: n, date: ['Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar'][i] + ' 2026', photo: '', link: '#' })),
      fund: {
        total: '0,00,000',
        count: '0',
        why: 'Sample note: a line on why this cause was chosen.',
        latest: { name: 'Sample Beneficiary', blurb: 'A sample line about who they are and what the show supported.', event: 'Sample Fundraiser Night', amount: '0,00,000', donate: '#' },
        past: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((n, i) => ({ month: ['Aug', 'Jun', 'Apr', 'Feb', 'Dec', 'Oct'][i] + ' 2026', name: 'Sample Cause ' + n, blurb: 'A sample line about the cause.', amount: '0,00,000', donate: '#' })),
        how: {
          choose: 'Sample text: how a beneficiary is chosen.',
          money: 'Sample text: how donations reach them.',
          share: 'Sample text: where we publish amounts.'
        }
      },
      mag: {
        latest: { no: '07', month: 'Oct 2026', cover: 'Sample cover line', link: '#' },
        past: rep(8, i => ({ no: String(Math.max(1, 6 - i)).padStart(2, '0'), month: 'Sample 2026', theme: 'Theme ' + (i + 1), link: '#' })),
        submit: { dates: '1 Nov to 30 Nov', theme: 'Sample theme', limit: '40 lines', after: 'Sample text: we reply within two weeks.' }
      },
      team: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'].map((n, i) => ({
        name: 'Team ' + n, role: ['Founder', 'Curator', 'Host', 'Editor', 'Design', 'Ops', 'Photographer', 'Volunteer'][i], line: 'A sample line about them.', photo: ''
      })),
      notes: ['Sample note: I came for one poem and stayed for all ten.', 'Sample note: the room listens like nowhere else.', 'Sample note: first time at a reading, will be back.'],
      wall: [
        { lines: ['the city', 'holds its breath', 'we listen'], by: 'a visitor' },
        { lines: ['say it slow', 'hands open', 'show up'], by: 'a visitor' },
        { lines: ['quiet room', 'loud heart', 'again tonight'], by: 'a visitor' }
      ]
    },

    /* ---------------- FAQ (shared) ---------------- */
    faq: [
      { q: 'How long is a slot?', a: 'Every reading has one feature poet with 12 minutes, seven poets with 5 minutes each, and two Spot Slots for poets from the audience.' },
      { q: 'What are Spot Slots?', a: 'Two places at every reading go to poets from the audience. Names go into a box, and two are drawn at random at the show.' },
      { q: 'Can I sign up for a Spot Slot in advance?', a: 'Yes. Put a slip in on this page before the reading. You still have to show up to be eligible, because the draw happens at the show.' },
      { q: 'Do I have to perform to come along?', a: 'No. Come to listen, cheer and be part of the room. Entry is free.' }
    ],

    /* ---------------- Magnet words ---------------- */
    magnetWords: ['poetry', 'belongs', 'everyone', 'come', 'join', 'us', 'listen', 'cheer', 'loudly', 'show', 'up', 'feel', 'it', 'tonight', 'verse', 'people', 'mic', 'say', 'slow', 'quiet', 'loud', 'heart', 'hands', 'open', 'city', 'breath', 'holds', 'we', 'again', 'room', 'light', 'rain', 'home', 'remember', 'hold', 'you', 'and', 'of', 'to', 'the', 'a', 'is', 'not']
  };
})();
