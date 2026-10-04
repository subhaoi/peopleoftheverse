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

  window.POV_CONTENT = {

    config: {
      // Set to false before going public to hide the Playground button.
      playground: true
    },

    /* ---------------- LIVE (fill these in) ---------------- */
    live: {
      links: {
        instagram: 'https://www.instagram.com/people_of_the_verse/',
        youtube: '#',                 // add when the channel exists
        feedback: '#',                // where the footer QR code should point
        email: '[EMAIL ADDRESS]'
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
