window.SITE_DATA = {
  darkenyaTeam: {
    title: "Darkenya",
    period: "Member since 15 Sep 2020",
    status: "Largely inactive since around 2023",
    description:
      "Darkenya is the Minecraft building team I joined in 2020. The team has been largely inactive for several years, but I am still technically part of it. The four builds below are the projects I worked on in connection with the team."
  },

  minecraftProjects: [
    {
      id: "vorbauprojekt",
      title: "Application map",
      group: "darkenya",
      kind: "Application build",
      years: "2020",
      description:
        "This was the map I built on my own for my application to Darkenya. It was the build I submitted to show what I could do before joining the team.",
      folder: "assets/minecraft/vorbauprojekt",
      maxImages: 20
    },
    {
      id: "frankfurt2099",
      title: "Frankfurt_2099",
      group: "darkenya",
      kind: "Team build",
      years: "2021",
      description:
        "Darkenya built several large structures around the Frankfurt_2099 project from the DAM (Deutsches Architekturmuseum). My contribution was roughly three quarters of the Opernturm, most of a bridge, parts of the streets and cars together with another team member, and the café interior in the DAM. I spent about 25 hours on the project.",
      folder: "assets/minecraft/frankfurt2099",
      maxImages: 20,
      videos: [
        {
          title: "Frankfurt2099 project video",
          url: "https://www.youtube.com/watch?v=Fs-JLoyeaZc"
        }
      ],
      links: [
        { label: "Frankfurt_2099 at the DAM", url: "https://dam-online.de/veranstaltung/frankfurt_2099/" }
      ]
    },
    {
      id: "reload",
      title: "ReLoAd",
      group: "darkenya",
      kind: "Team build",
      years: "2022",
      description:
        "A Darkenya team project in which we built the lobby for Reload. Their old website appears to be offline now, but videos of the finished build are still available.",
      folder: "assets/minecraft/reload",
      maxImages: 20,
      links: [
        { label: "ReLoAd YouTube Channel", url: "https://www.youtube.com/@reload_works/" },
      ]
    },
    {
      id: "rpg",
      title: "RPG",
      group: "darkenya",
      kind: "Team project",
      years: "Unfinished",
      description:
        "RPG stands for role-play game. It was an internal Darkenya team project and was never completed. My contribution was fairly small: I built several of the swamp houses, reshaped part of the beach terrain and added a few smaller details.",
      folder: "assets/minecraft/rpg",
      maxImages: 20
    },

    {
      id: "foxlay-lobby",
      title: "Foxlay Lobby",
      group: "independent",
      kind: "Lobby build",
      years: "2024-WIP",
      description:
        "An work-in-progress lobby build for Foxlay. It's collaboration with a few other people.",
      folder: "assets/minecraft/foxlay-lobby",
      maxImages: 20
    },
    {
      id: "bahnstrecke",
      title: "Bahnstrecke",
      group: "independent",
      kind: "Personal build",
      years: "2022-WIP",
      description:
        "Its my creative world for everything but started with a project of building a railway around a whole mesa biome, after I and Zug2003 transformed a desert village next to the mesa biome.",
      folder: "assets/minecraft/bahnstrecke",
      maxImages: 20
    },
    {
      id: "minecraft-ing-tower",
      title: "minecraft.ING: Tower — Special Award",
      group: "independent",
      kind: "Competition entry",
      years: "2025",
      description:
        "A personal Minecraft engineering competition entry for the Brandenburg Chamber of Engineers (BBIK). Sadly the website describing the competition is offline, but it was the goal to give a pre-built water tower a second life and design how it should look. This model received a special award, since there weren't enough entries its age category to rank 1st to 3rd place.",
      folder: "assets/minecraft/minecraft-ing-tower",
      maxImages: 20,
      links: [
        { label: "Award video", url: "https://www.youtube.com/watch?v=fXBKS1ODWRc" }
      ]
    },
    {
      id: "minecraft-ing-first-place",
      title: "minecraft.ING — 1st Place",
      group: "independent",
      kind: "Competition entry",
      years: "2024",
      description:
        "A personal Minecraft engineering competition entry for the Brandenburg Chamber of Engineers (BBIK). Sadly the website describing the competition is offline, but it was the goal to build the perfect place for you and your friends. there should be at least 3 main attractions. The entry received first place in its age category.",
      folder: "assets/minecraft/minecraft-ing-first-place",
      maxImages: 20,
      links: [
        { label: "Award video", url: "https://www.youtube.com/watch?v=8YJaSTEUhY0" }
      ]
    },
    {
      id: "sumpfdorf",
      title: "Mangroove village",
      group: "independent",
      kind: "Build with theredmachine",
      years: "2023",
      description:
        "A village theredmachine and I built together in around 20 hours.",
      folder: "assets/minecraft/sumpfdorf",
      maxImages: 20
    },
    {
      id: "frankfurt2099-personal",
      title: "Frankfurt_2099 — Personal Entry",
      group: "independent",
      kind: "Competition entry",
      years: "2021",
      description:
        "Separate from Darkenya's work, I also built a tower for the official Frankfurt_2099 competition together with Vinctilus.",
      folder: "assets/minecraft/frankfurt2099-personal",
      maxImages: 20,
      links: [
        { label: "Competition information", url: "https://dam-online.de/veranstaltung/frankfurt_2099/" }
      ]
    },
    {
      id: "weiteres",
      title: "Other",
      group: "independent",
      kind: "Some smaller builds",
      years: "2021-now",
      description:
        "A collection of builds that arent worth an own card, but are still somewhat nice.",
      folder: "assets/minecraft/weiteres",
      maxImages: 25
    },
  ],

  /*
    ADD A VIDEO WITH JUST A TITLE + YOUTUBE URL.
    `kind` is optional. /shorts/ links automatically use the vertical layout.

    PLAYLISTS:
    Keep the playlist URL as `url`.
    Add ONE `previewVideoId` to choose the thumbnail shown on the portfolio card.
    The card still opens the complete playlist.
  */
  videos: [
    { title: "Music Video", kind: "Music video", url: "https://youtu.be/wXfRy30SOZs?si=_sxXsmX0DeodofjG" },
    { title: "Minecraft Montage", kind: "Montage", url: "https://youtu.be/TqTqAMahTnk?si=HBTGXuPqtt8wOrSr" },
    { title: "Minecraft Short Film", kind: "Short film", url: "https://youtu.be/0Bp_Bo3tYAE?si=rvRsgOtQsBZBZZY8" },
    {
      title: "Humanists Podcast",
      kind: "Podcast",
      url: "https://youtube.com/playlist?list=PLWi1C3BW3oLWAGuf_GBL7f_0pkYO7h8z_&si=YwhnapEtSDaSigXq",
      previewVideoId: "IiGT0wuebrc"
    },
    { title: "drug policies", url: "https://www.youtube.com/shorts/LaytLl5nhCQ" },
    { title: "Wahlswiper", url: "https://www.youtube.com/shorts/jdaxC72NQ_c" },
    { title: "Canada and EU", url: "https://www.youtube.com/shorts/Z35Y6K47iIs" },
    { title: "montage - demonstration", url: "https://www.youtube.com/shorts/JR14YCUKgQY" }
  ],

  humanistsTimeline: [
    {
      period: "July 2024 — June 2026",
      role: "Video Team — Member",
      points: [
        "Edited short- and long-form videos for social media and internal use.",
        "Developed and implemented ideas for video projects."
      ]
    },
    {
      period: "October 2024 — June 2026",
      role: "Video Team — Lead",
      points: [
        "Organized projects and file structures.",
        "Delegated tasks and coordinated ongoing work.",
        "Managed and onboarded team members.",
        "Planned and led regular team meetings.",
        "Guided and supported team members with video editing.",
        "Coordinated with other teams, the federal executive board and additional members."
      ]
    },
    {
      period: "December 2024 — June 2026",
      role: "Social Media Admin",
      points: [
        "Planned, commissioned and published social-media posts.",
        "Evaluated posts with regard to reach and interaction.",
        "Coordinated with teams to create and prepare content."
      ]
    },
    {
      period: "December 2024 — June 2026",
      role: "Podcast Team — Lead",
      points: [
        "Implemented a podcast format including test episodes and editing."
      ]
    }
  ],

  /*
    Optional gallery metadata. Numbering matches the image filename.

    IMPORTANT:
    `photography` appears ONCE and `drawings` appears ONCE.
    Put every numbered item inside those two objects.
  */
  galleryMeta: {
    photography: {
      "88": { title: "Climate Change" },
      "90": { title: "Wildlife" }
    },
    drawings: {
      "01": { title: "(K)eine Kognitive Dissonanz", medium: "colored pencils, markers, watercolor" },
      "02": { title: "Kunst", medium: "watercolor, colored pencils, markers" },
      "03": { title: "Das Fest Der Liebe", medium: "colored pencils, markers, watercolor" },
      "04": { title: "Der Richtige", medium: "colored pencils, markers, watercolor" },
      "05": { title: "", medium: "colored pencils, watercolor" },
      "06": { title: "полуниця", medium: "tape" },
      "07": { title: "Skyline", medium: "tape" },
      "08": { title: "Caly", medium: "colored pencils, white markers" },
      "09": { title: "", medium: "colored pencils, watercolor" },
      "10": { title: "Charles", medium: "colored pencils, markers" },
      "11": { title: "", medium: "colored pencils, watercolor, white markers" },
      "12": { title: "", medium: "colored pencils, markers" },
      "13": { title: "", medium: "colored pencils, white markers" },
      "14": { title: "", medium: "colored pencils, markers" },
      "15": { title: "", medium: "pencils" },
      "16": { title: "", medium: "fineliner, watercolor, white markers" },
      "17": { title: "", medium: "colored pencils" },
      "18": { title: "Rica", medium: "colored pencils, watercolor" },
      "19": { title: "", medium: "colored pencils, white markers" },
      "20": { title: "Capybara", medium: "colored pencils, white markers" },
      "21": { title: "Lost", medium: "pencils" },
      "22": { title: "", medium: "pencils" },
      "23": { title: "Haunted", medium: "pencils" },
      "24": { title: "", medium: "colored pencils, watercolor, markers" },
      "25": { title: "", medium: "colored pencils, markers" },
      "26": { title: "The Reaper", medium: "pencils, markers, watercolor, colored pencils" },
      "27": { title: "", medium: "colored pencils, markers" },
      "28": { title: "", medium: "pencils, watercolor" },
      "29": { title: "Verlustangst", medium: "markers, digital medium" },
      "30": { title: "", medium: "white colored pencil" },
      "31": { title: "", medium: "colored pencils, markers" }
    }
  },

  timeline: []
};
