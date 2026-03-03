/**
 * MUSEUM DATA
 * Edit this file to update all ePortfolio content.
 * The 3D museum reads from this data to populate exhibits.
 */

const MUSEUM_DATA = {
    coverLetter: {
        title: "Welcome",
        buildContent: function() {
            var img = (typeof WELCOME_IMAGE_DATA !== 'undefined') ? WELCOME_IMAGE_DATA : {};
            return '' +
            /* ---- Hook ---- */
            '<p style="text-align:center; font-size:1.8rem; font-weight:bold; color:#e8d5b7; font-family:Georgia,serif; line-height:1.3; font-style:italic; letter-spacing:0.02em; margin:0 0 1rem;">' +
                'We can learn a lot about humans from dead birds.' +
            '</p>' +

            /* ---- Section 1: text left, pic1 right ---- */
            '<div style="display:flex; gap:1rem; margin-bottom:1rem;">' +
                '<div style="flex:1;">' +
                    '<p style="margin:0;">Not <em>those</em> birds, rather the extinct kind: dinosaurs. A particularly poignant example is Sue the <em>Tyrannosaurus Rex</em>. She is a skeleton of scars. Lumps on her ribs. An oversized leg bone. Punctured holes on her lower jaw. These oddities on her bones are not superficial marks but deep-rooted pains forgotten for 67 million years and only rediscovered by chance in the South Dakota Badlands. Broken ribs. An infected fibula. Holes of the parasitic infection trichomonosis\u2026 eventually leading to death by starvation. These scars tell a tale of struggles and downfalls that seem too much to bear.</p>' +
                '</div>' +
                '<div style="flex:0 0 40%;">' +
                    (img.pic1 ? '<img src="' + img.pic1 + '" style="width:100%; border-radius:4px; display:block;">' : '') +
                '</div>' +
            '</div>' +

            /* ---- Section 2: full-width text ---- */
            '<p style="margin:0 0 1rem;">Growing up in the quiet village of Skokie, Illinois, the prolonging dullness of my childhood was quelled by the excitement I found in dinosaurs. What began as fascination transformed into curiosity: not just <em>what</em> happened to them, but <em>how</em> bodies record trauma and adapt to survive. Through fossils, I learned to read bones as narratives of resilience, vulnerability, and life.</p>' +

            /* ---- Section 3: pic2 left, text right ---- */
            '<div style="display:flex; gap:1rem; margin-bottom:1rem;">' +
                '<div style="flex:0 0 35%;">' +
                    (img.pic2 ? '<img src="' + img.pic2 + '" style="width:100%; border-radius:4px; display:block;">' : '') +
                '</div>' +
                '<div style="flex:1; display:flex; flex-direction:column; justify-content:center;">' +
                    '<p style="margin:0 0 0.6rem;">That curiosity eventually turned inward.</p>' +
                    '<p style="margin:0 0 0.6rem;">If ancient bones could reveal so much about pain and survival, what could living bodies teach us?</p>' +
                    '<p style="margin:0;">This question drew me toward the human body and ultimately to medicine \u2014 not to study anatomy and physiology in isolation but to understand people through their stories.</p>' +
                '</div>' +
            '</div>' +

            /* ---- Section 4: full-width text ---- */
            '<p style="margin:0 0 1rem;">I first entered Stanford University as a strict pre-medical student, but after my experience as a Hoover Student Fellow at the Hoover Institution studying research security, I became further captivated by the intertwined nature of science, technology, and law for real societal effects. Since then, I have pursued opportunities in science to learn discovery, engineering to learn technical skills, and international security to learn deployment of innovation to benefit the greater public. Throughout these experiences, it has only become more evident to me the power of communication in bridging gaps between disparate stakeholders as a means to combine forces for the greatest impact possible.</p>' +

            /* ---- Section 5: two images side by side ---- */
            '<div style="display:flex; gap:0.8rem; margin-bottom:1rem;">' +
                '<div style="flex:1;">' +
                    (img.pic3 ? '<img src="' + img.pic3 + '" style="width:100%; display:block; border-radius:4px;">' : '') +
                '</div>' +
                '<div style="flex:1;">' +
                    (img.pic4 ? '<img src="' + img.pic4 + '" style="width:100%; display:block; border-radius:4px;">' : '') +
                '</div>' +
            '</div>' +

            /* ---- Section 6: closing text ---- */
            '<p style="margin:0;">My goal in pursuing the Notation in Science Communication is to learn and reflect on how to become a better advocate of science and technology. I believe no field is truly isolated and that recognizing the interdisciplinarity of the world is the key for future progress, just like how Sue communicated to me how to become a better human.</p>';
        }
    },

    aboutMe: {
        title: "About Me",
        content: '<div style="text-align:center; margin-bottom:1rem;">' +
            '<img src="assets/images/headshot_eportfolio.png" style="width:180px; height:180px; border-radius:50%; object-fit:cover; display:block; margin:0 auto; border:3px solid #c9a96e;">' +
            '</div>' +
            '<p>Hi! I\u2019m T. Matthew Kim, a senior at Stanford University from Irvine, California. I\u2019m pursuing a B.S. in Biology and Computer Science, a coterminal M.S. in Computer Science on the Artificial Intelligence track, Honors in International Security, and a Notation in Science Communication. In other words, I\u2019m interested in how science, technology, and policy can work together to drive responsible, impactful innovation.</p>' +
            '<p>That interest has taken me in a few directions. In research, I\u2019ve built ex-vivo perfusion systems for heart transplantation, performed endourologic research on kidney stones, and analyzed sycophancy in AI for healthcare. On the policy and security side, I\u2019ve researched international collaborations in science and technology at the Hoover Institution, prototyped medical AI systems for biosecurity and biodefense, and contributed to a course on security and privacy in bioinformatics.</p>' +
            '<p>This portfolio captures how I think about science communication \u2014 not just as a skill but as a practice that shapes how ideas move between disciplines, audiences, and communities.</p>' +
            '<p>My other interests include fossil collecting, origami, cubing, golfing, hiking, and traveling. Feel free to reach out at <a href="mailto:tmattkim@stanford.edu" style="color:#c9a96e;">tmattkim@stanford.edu</a> if you\u2019d like to connect!</p>'
    },

    aboutPortfolio: {
        title: "About This ePortfolio",
        content: '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Purpose</h3>' +
            '<p>This ePortfolio is the capstone project for my Notation in Science Communication (NSC) at Stanford University. It brings together nine artifacts spanning three thematic categories \u2014 Reveal, Bridge, and Build \u2014 each accompanied by reflections on the rhetorical choices, audience considerations, and lessons learned during their creation. Together, they document my growth as a science communicator across multimedia, policy, and technical contexts.</p>' +

            '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Design</h3>' +
            '<p>This ePortfolio is presented as an interactive 3D museum visitors can walk through, built with <strong>Three.js</strong> (r128). Each wing of the museum corresponds to a thematic category, and exhibits are displayed as framed artworks on the walls. The museum metaphor was chosen to evoke the experience of discovery and curation, reinforcing the idea that each artifact is a carefully placed exhibit in a larger narrative.</p>' +

            '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Tech Stack</h3>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.3rem 1.5rem; margin:0.5rem 0 1rem;">' +
                '<div><span style="color:#a89b8c;">3D Engine</span><br><strong>Three.js r128</strong></div>' +
                '<div><span style="color:#a89b8c;">Language</span><br><strong>Vanilla JavaScript</strong></div>' +
                '<div><span style="color:#a89b8c;">Styling</span><br><strong>CSS3</strong></div>' +
                '<div><span style="color:#a89b8c;">Markup</span><br><strong>HTML5</strong></div>' +
            '</div>' +

            '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Typography</h3>' +
            '<p><strong>Georgia</strong> (serif) is used for headings, body text, and exhibit labels, chosen for its readability and classical tone. <strong>Helvetica Neue / Arial</strong> (sans-serif) is used for UI elements, controls, and captions. <strong>Monospace</strong> is used for keyboard hints and technical labels.</p>' +

            '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Color Palette</h3>' +
            '<div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin:0.5rem 0 1rem;">' +
                '<div style="text-align:center;">' +
                    '<div style="width:48px; height:48px; border-radius:6px; background:#1a1a2e; border:1px solid #555; margin:0 auto 4px;"></div>' +
                    '<span style="font-size:11px; color:#a89b8c;">#1a1a2e<br>Background</span>' +
                '</div>' +
                '<div style="text-align:center;">' +
                    '<div style="width:48px; height:48px; border-radius:6px; background:#0e0e1a; border:1px solid #555; margin:0 auto 4px;"></div>' +
                    '<span style="font-size:11px; color:#a89b8c;">#0e0e1a<br>Deep BG</span>' +
                '</div>' +
                '<div style="text-align:center;">' +
                    '<div style="width:48px; height:48px; border-radius:6px; background:#c9a96e; margin:0 auto 4px;"></div>' +
                    '<span style="font-size:11px; color:#a89b8c;">#c9a96e<br>Gold Accent</span>' +
                '</div>' +
                '<div style="text-align:center;">' +
                    '<div style="width:48px; height:48px; border-radius:6px; background:#e8d5b7; margin:0 auto 4px;"></div>' +
                    '<span style="font-size:11px; color:#a89b8c;">#e8d5b7<br>Headings</span>' +
                '</div>' +
                '<div style="text-align:center;">' +
                    '<div style="width:48px; height:48px; border-radius:6px; background:#a89b8c; margin:0 auto 4px;"></div>' +
                    '<span style="font-size:11px; color:#a89b8c;">#a89b8c<br>Subtext</span>' +
                '</div>' +
                '<div style="text-align:center;">' +
                    '<div style="width:48px; height:48px; border-radius:6px; background:#f0e6d3; margin:0 auto 4px;"></div>' +
                    '<span style="font-size:11px; color:#a89b8c;">#f0e6d3<br>Body Text</span>' +
                '</div>' +
            '</div>' +

            '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Photography</h3>' +
            '<p>All photos of fossils featured in this ePortfolio are from my personal collection or from my travels to museums and sites of paleontological significance.</p>' +

            '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Acknowledgments</h3>' +
            '<p>Thank you to Dr. Katherine Rothschild, Dr. Kevin Moore, and Dr. Erin Mordecai for their incredible guidance, as well as all of my friends in the Notation in Science Communication program at Stanford who made this ePortfolio possible. I would also like to thank Dr. Ron Kopito, Dr. Pranav Rajpurkar, Dr. Mejgan Massoumi, and everyone else who has supported me on my academic adventure. A special shout out to my family who give me the strength to improve myself every day!</p>'
    },

    exhibits: {
        trilobite: {
            name: "Trilobite Wing",
            subtitle: "Reveal",
            color: 0x8B7355,
            description: "Over 500 million years ago, trilobites became the first organisms to develop complex, compound eyes, an evolutionary leap that transformed how life could perceive and interact with the world. What was once a blur of undifferentiated stimuli became structured, navigable information. The artifacts in this category represent that same transformative act: taking raw, dense, or abstract scientific information and rendering it into something perceptible and interpretable. Whether through data visualization, diagrammatic representation, or careful rhetorical framing, these works demonstrate my ability to give shape to complexity, making the invisible visible and the opaque legible for non-specialist audiences. Just as the trilobite's eyes did not create the world around it but revealed what was already there, these artifacts aim to clarify rather than simplify science.",
            artifacts: [
                {
                    title: "Paleostoric YouTube Video",
                    thumbnail: 'trilobite-0',
                    content: '<a href="https://www.youtube.com/watch?v=DSb_AsUHt-U" target="_blank" rel="noopener" style="display:block; position:relative; margin-bottom:1rem; border-radius:6px; overflow:hidden; cursor:pointer; text-decoration:none;">' +
                        '<img src="' + (typeof EXHIBIT_THUMBNAILS !== 'undefined' && EXHIBIT_THUMBNAILS['trilobite-0'] ? EXHIBIT_THUMBNAILS['trilobite-0'] : 'https://img.youtube.com/vi/DSb_AsUHt-U/hqdefault.jpg') + '" style="width:100%; display:block; border-radius:6px;">' +
                        '<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.3);">' +
                            '<div style="width:68px; height:48px; background:rgba(255,0,0,0.85); border-radius:12px; display:flex; align-items:center; justify-content:center;">' +
                                '<div style="width:0; height:0; border-left:18px solid #fff; border-top:11px solid transparent; border-bottom:11px solid transparent; margin-left:4px;"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div style="position:absolute; bottom:0; left:0; right:0; padding:8px 12px; background:rgba(0,0,0,0.7); color:#ccc; font-size:13px;">Click to watch on YouTube</div>' +
                    '</a>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Overview</h3>' +
                        '<p>This artifact is my first video from Paleostoric, a YouTube channel I created during high school to share my fossil collection and build an online community of enthusiasts. Titled <em>A Rare Trilobite So Well Preserved It Looks Alive | Pyritized Trilobite</em>, the video showcases my pyritized <em>Triarthrus eatoni</em> trilobite from New York, which I acquired at the annual Tucson Fossil Showcase.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Communicating Science to a Broad Audience</h3>' +
                        '<p>My primary goal was accessibility. I wanted anyone, from a curious twelve-year-old to an adult with no paleontology background, to follow along and feel genuinely excited about the specimen. To achieve this, I minimized jargon, let close-up visuals of the fossil do much of the explanatory work, and structured the narrative around what makes this trilobite remarkable rather than burying the appeal under technical detail. As my first video, I also experimented with conventions common to the medium: an intro, an outro, B-roll footage, and background music. At the time, my decisions about pacing and arrangement were largely intuitive, guided more by what felt right than by any deliberate rhetorical strategy.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Learning from Analytics and Audience Feedback</h3>' +
                        '<p>Out of all my videos, this debut remains my most successful, with 22,097 views as of this writing. That reach brought something I had not initially anticipated: substantive feedback. Commenters pointed to specific areas for improvement, particularly audio quality and limiting distortion, technical elements I now realize directly affect how clearly science is communicated through multimedia.</p>' +
                        '<p>YouTube\u2019s analytics proved equally instructive. By examining where viewership dropped off, I discovered that the steepest decline occurred during an extended segment where I simply rotated the specimen on camera without narration or context. While editing, I had struggled to cut sections I felt attached to, but the data confirmed what I suspected on rewatching. Without purposeful framing, even a stunning fossil loses a viewer\u2019s attention.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Key Takeaways</h3>' +
                        '<p>This experience crystallized two principles I now carry into all my communicative work. First, audiences value their time, so every moment of a presentation should demonstrate why the content matters. Second, restraint strengthens impact. If I\u2019m debating whether to keep a section, it is almost always better to cut it and preserve only what resonates most. Together, these lessons have shaped how I think about rhetorical choices across formats, pushing me to prioritize clarity, engagement, and intentional design whenever I translate science for an audience.</p>',
                    reflection: null,
                    image: null
                },
                {
                    title: "PaleoPals Storytelling Podcast",
                    thumbnail: 'trilobite-1',
                    content: '<div style="text-align:center; margin-bottom:1rem;">' +
                        '<img src="' + (typeof EXHIBIT_THUMBNAILS !== 'undefined' && EXHIBIT_THUMBNAILS['trilobite-1'] ? EXHIBIT_THUMBNAILS['trilobite-1'] : '') + '" style="max-width:280px; width:100%; border-radius:6px; display:block; margin:0 auto;">' +
                    '</div>' +
                    '<div style="text-align:center; margin-bottom:1.2rem;">' +
                        '<a href="https://drive.google.com/file/d/13m9hR8sR9TSti_s3LmDwL6VycsPPz3GR/view?usp=sharing" target="_blank" rel="noopener" style="display:inline-block; padding:10px 24px; background:#c9a96e; color:#1a1a2e; border-radius:6px; text-decoration:none; font-weight:bold; font-size:14px;">Listen to the Podcast</a>' +
                    '</div>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Overview</h3>' +
                        '<p>This artifact is a podcast episode I produced for PWR 91KA (Science Storytelling for Kids) during the spring of my junior year. The open-ended assignment asked us to create a children\u2019s science podcast on any topic, giving us full creative control over format and execution. I designed the cover art and built the episode around two original characters: Mesozoic Matt and his sidekick, Clucky the Chicken.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Designing for a Specific Audience</h3>' +
                        '<p>I saw this project as a chance to revisit what I loved about making YouTube videos but in a purely audio medium with a much more precisely defined audience: children aged six to eight. That specificity forced me to think far more deliberately about structure and presentation than I had in previous work. During brainstorming, I kept returning to the shows I gravitated toward as a kid, such as <em>Dino Dan</em>, <em>Dinosaur Train</em>, <em>SpongeBob SquarePants</em>, and noticed a recurring device in programs like <em>Go, Diego, Go!</em>, <em>Dora the Explorer</em>, and <em>Blue\u2019s Clues</em>: the animal sidekick. That observation led me to create Clucky the Chicken as a companion to Mesozoic Matt. The pairing felt fitting given that chickens are living descendants of theropod dinosaurs, including the <em>Tyrannosaurus rex</em>, which allowed me to embed a real scientific connection directly into the show\u2019s premise. I also incorporated detective-style elements so that young listeners would feel as though they were being brought along on an investigative adventure.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Crafting Narrative Around Science</h3>' +
                        '<p>The most challenging part of the process was shaping paleontological content into a coherent storyline with genuine emotional stakes. Early drafts focused too heavily on delivering scientific information, which left the narrative flat. The in-class workshops, particularly the writers\u2019 room sessions where small groups brainstormed and critiqued each other\u2019s ideas, were instrumental in helping me rethink my approach. I shifted the center of gravity from the science itself to Clucky\u2019s personal arc: his journey from believing he is insignificant to realizing he descends directly from the survivors of the asteroid impact. The science became woven throughout that emotional thread rather than competing with it.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Using Music as a Rhetorical Tool</h3>' +
                        '<p>This project also marked a turning point in how I use music. Reflecting on my YouTube work, I recognized that I had placed background tracks somewhat haphazardly, without considering how they shape a listener\u2019s emotional response. For the podcast, I was much more intentional, selecting and timing music to mirror the characters\u2019 emotional journey so that listeners could feel the tension, wonder, and resolution alongside Clucky and Matt. The greatest lesson I took from this artifact is the power of evoking emotion to create lasting impact and that music is one of the most effective tools for doing so in an audio medium.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Feedback and Iteration</h3>' +
                        '<p>Peer feedback during the course highlighted specific areas I would still like to refine, including balancing audio levels at certain points and rewriting portions of the script to integrate scientific information more seamlessly. We also had the opportunity to share our podcasts with a class of fifth graders, who proved to be the harshest of critics. Several of them asked why the podcast felt \u201cso childish,\u201d which, rather than discouraging me, was actually reassuring. It confirmed that I had successfully calibrated the tone and complexity for my intended audience of six- to eight-year-olds rather than for older elementary students. That moment reinforced how much audience awareness matters and how even critical feedback can validate a deliberate rhetorical choice.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Key Takeaways</h3>' +
                        '<p>This project deepened my understanding of three principles I continue to apply. First, narrative is the vehicle, not the obstacle. Science becomes more memorable and persuasive when it is embedded within a story audiences care about rather than presented as standalone information. Second, every production choice is a rhetorical choice. Music, pacing, and character design are not decorative but actively shape how an audience receives and feels the content. Third, defining a precise audience from the outset transforms every subsequent decision, from vocabulary and tone to narrative complexity. Real-world testing with that audience, even when the feedback stings, is the most reliable way to know whether those choices landed.</p>',
                    reflection: null,
                    image: null
                },
                {
                    title: "Artifact 3: [Title]",
                    content: "<p>[Description of third artifact.]</p>",
                    reflection: "<p>[Reflection on this artifact.]</p>",
                    image: null
                }
            ]
        },
        archaeopteryx: {
            name: "Archaeopteryx Wing",
            subtitle: "Bridge",
            color: 0x6B8E6B,
            description: "<em>Archaeopteryx</em> represents one of the most crucial transitions in evolutionary history: the link between terrestrial dinosaurs and modern birds. It is an organism that belonged fully to neither world yet connected both. The artifacts in this category serve a similar function, bridging disciplinary boundaries, translating between expert and public audiences, and facilitating understanding across communities that might otherwise remain siloed. These works reflect the communicative challenge of operating at the threshold, which involves adapting tone, terminology, and rhetorical strategy to the needs of different contexts without sacrificing scientific rigor. Like <em>Archaeopteryx</em> itself, these artifacts do not simply exist in two worlds; they make passage between them possible, demonstrating that effective science communication is fundamentally an act of translation and distillation.",
            artifacts: [
                {
                    title: "Project Biosecurity",
                    thumbnail: 'archaeopteryx-0',
                    content: '<div style="text-align:center; margin-bottom:1rem;">' +
                        '<img src="' + (typeof EXHIBIT_THUMBNAILS !== 'undefined' && EXHIBIT_THUMBNAILS['archaeopteryx-0'] ? EXHIBIT_THUMBNAILS['archaeopteryx-0'] : '') + '" style="max-width:400px; width:100%; border-radius:6px; display:block; margin:0 auto;">' +
                    '</div>' +
                    '<div style="text-align:center; margin-bottom:1.2rem;">' +
                        '<a href="https://project-biosecurity.vercel.app/" target="_blank" rel="noopener" style="display:inline-block; padding:10px 24px; background:#c9a96e; color:#1a1a2e; border-radius:6px; text-decoration:none; font-weight:bold; font-size:14px;">Play the Game</a>' +
                    '</div>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Overview</h3>' +
                        '<p>This artifact is an interactive AI simulation game I built for PWR 91NSC (Introduction to Science Communication) during the autumn of my senior year. The assignment asked us to distill a literature review written earlier in the quarter into a \u201cpublic audience text.\u201d I chose to create a browser-based video game aimed at teenagers in which the player assumes the role of the President of the United States navigating a crisis involving AI-enabled bioweapons.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Translating Technical Research into an Immersive Experience</h3>' +
                        '<p>When I first began development, I worried the scope was too ambitious. Capturing the full breadth of my literature review, a dense paper on a weighty topic, across multiple scenes with coherent narrative progression felt overwhelming. Much of what ultimately shaped the project came from peer feedback and consulting sessions with Dr. Kath, and the rest of this reflection details the key decisions that emerged from that collaborative process.</p>' +
                        '<p>A central goal was immersion. My literature review addresses a timely subject driven by real-world developments, yet its technical register can distance readers from the urgency of the issue. Through iterative feedback, I discovered that immersion often hinges on small, deliberate details. Subtle design choices like the beeps punctuating each scene or smoother transition animations drew consistently positive responses and made gameplay more engaging. I also aimed to establish a serious tone, and one peer confirmed this had been achieved, describing the layout, fonts, and color palette as having an overall \u201csterile\u201d quality that suited the mission-driven subject matter.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Designing Meaningful Player Agency</h3>' +
                        '<p>Much of my focus went into the decision architecture, the branching scenes a player navigates. In my original version, every path led to the same failed outcome. After discussion with Dr. Kath, I reconsidered. While I had initially conceived the game as a commentary on a dire present-day situation, I came to believe that including a winnable path could offer hope while simultaneously demonstrating what effective policy steps might look like in the real world. The challenge was integrating that optimism without undermining the gravity of the topic.</p>' +
                        '<p>Rather than a simple win-or-lose binary, I implemented a scoring system tied to the player\u2019s actions and character interactions, leading to a spectrum of outcomes, including outright failure, a pyrrhic victory in which the crisis is resolved but at significant cost, and a genuinely successful resolution with its own associated reflection. This range, I hoped, would more realistically capture the complexity of navigating a biosecurity crisis and the varied futures such decisions could produce.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Building a Cast to Deepen Realism</h3>' +
                        '<p>Part of expanding the decision space meant adding more characters. My original version featured only the Presidential Daily Briefer and the National Security Council, referred to by title alone. I broadened the cast to include expert advisors, a CIA analyst, the National Security Advisor, the Secretary of State, and the Secretary of Defense, each given a name, a distinct color, and an icon. The CIA analyst, for instance, is Marcus Rivera, associated with green and a brain icon. These details served a dual purpose: they made interactions feel like conversations with real people rather than abstract institutions, and the visual associations helped players quickly identify who was speaking and what domain of expertise they represented.</p>' +
                        '<p>These new characters, in turn, opened up new narrative possibilities. The expert advisors enabled a consultation mechanic. For example, the Secretary of State and Secretary of Defense created branching paths toward diplomatic or military responses, respectively. Each addition reinforced the game\u2019s core rhetorical aim, letting players feel the weight and complexity of presidential decision-making during a crisis.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Key Takeaways</h3>' +
                        '<p>This project taught me three lasting lessons. First, distilling and translating specialist research for a broad audience is not about simplifying. It is about finding the right vehicle, and an interactive simulation allowed me to preserve the complexity of my literature review while making it viscerally felt rather than passively read. Second, immersion lives in the details. Tone, sound design, color, and typography are not cosmetic but rhetorical choices that shape how seriously an audience engages with the content. Third, feedback is most powerful when it challenges foundational assumptions. The shift from a single failed outcome to a spectrum of endings fundamentally changed the message of the game, turning it from a warning into both a warning and an invitation to act.</p>',
                    reflection: null,
                    image: null
                },
                {
                    title: "Artifact 2: [Title]",
                    content: "<p>[Description of artifact.]</p>",
                    reflection: "<p>[Reflection.]</p>",
                    image: null
                },
                {
                    title: "Artifact 3: [Title]",
                    content: "<p>[Description of artifact.]</p>",
                    reflection: "<p>[Reflection.]</p>",
                    image: null
                }
            ]
        },
        neanderthal: {
            name: "Neanderthal Wing",
            subtitle: "Build",
            color: 0x7B6B8E,
            description: "Neanderthals are our closest extinct relatives, so genetically proximate that 1–4% of the modern human genome still carries their legacy. However, they are gone, and we remain. Their story is not simply one of extinction but of near-persistence, a reminder that survival depends not just on capability but on adaptability, collaboration, and the capacity to build forward. The artifacts in this category engage with that forward-looking imperative. They represent my contributions to technological development and applied science communication in technical and professional contexts. Where the Trilobite reveals and the <em>Archaeopteryx</em> bridges, the Neanderthal builds. These pieces reflect on the tools, systems, and communicative practices that will shape the future of scientific work, and on the professional identity I am crafting as someone who does not just describe science but participates in its trajectory.",
            artifacts: [
                {
                    title: "PWR 91NSC Literature Review",
                    thumbnail: 'neanderthal-0',
                    content: '<div style="text-align:center; margin-bottom:1rem;">' +
                        '<img src="' + (typeof EXHIBIT_THUMBNAILS !== 'undefined' && EXHIBIT_THUMBNAILS['neanderthal-0'] ? EXHIBIT_THUMBNAILS['neanderthal-0'] : '') + '" style="max-width:280px; width:100%; border-radius:6px; display:block; margin:0 auto; box-shadow:0 2px 12px rgba(0,0,0,0.4);">' +
                    '</div>' +
                    '<div style="text-align:center; margin-bottom:1.2rem;">' +
                        '<a href="assets/docs/PWR_91NSC_Literature_Review.pdf" target="_blank" rel="noopener" style="display:inline-block; padding:10px 24px; background:#c9a96e; color:#1a1a2e; border-radius:6px; text-decoration:none; font-weight:bold; font-size:14px;">Read the Paper (PDF)</a>' +
                    '</div>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Overview</h3>' +
                        '<p>This artifact is a literature review titled <em>Preventing the First Weapon of Mass Extinction: Addressing Artificial Intelligence for Bioweapons Development</em>, written for PWR 91NSC (Introduction to Science Communication) during the autumn of my senior year. The review examines the intersection of three disciplines \u2014 artificial intelligence, biosecurity, and international security theory \u2014 to argue that AI has fundamentally shifted the bioweapons threat landscape, making deterrence by denial and robust biodefense the only viable path forward. The paper was styled according to the submission guidelines of <em>International Security</em>, a leading journal in the field of international relations and security.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Writing Across Disciplinary Boundaries</h3>' +
                        '<p>The most formative challenge of this project was deciding who I was writing for. My topic sits at the convergence of three distinct discourse communities, each with its own conventions, vocabulary, and assumptions. Rather than writing exclusively for one, I chose to make the review accessible to all three, a deliberate rhetorical decision aimed at bridging gaps between disciplines that do not speak to one another enough. In practice, this meant defining terms that would be familiar to one community but opaque to another (i.e., explaining deterrence theory for an AI audience and explaining biological design tools for a security studies audience) and drawing from literature across all three fields to weave an interdisciplinary narrative. While I believe I largely succeeded, the only true test would be for members of each community to read the review and identify where clarity breaks down, a form of feedback I hope to seek out in the future.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Navigating a Rapidly Evolving Field</h3>' +
                        '<p>Synthesizing the literature itself proved unexpectedly difficult. I initially searched within the narrow scope of AI for biodefense, which returned very little. Broadening the framing to encompass AI\u2019s offensive and defensive roles in biosecurity opened up a much richer body of work but introduced a new problem: the field was evolving faster than I could write. Articles published only months apart contradicted one another, and breakthroughs regularly rendered earlier findings obsolete. For example, the National Academies assessed in April 2025 that biological design tools could not create self-replicating pathogens. By September 2025, a preprint had already disproven that claim. I had to make conscious, sometimes difficult choices about what to include and what to set aside, always asking whether a given development was necessary for the reader to follow the argument\u2019s logic.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Structuring the Argument</h3>' +
                        '<p>Grouping the literature into a coherent structure required extensive iteration. I treated the headers and subheaders as a working outline, testing different combinations of topics and orderings until I arrived at a progression that felt logical: AI\u2019s offensive capabilities, deterrence theory and its three camps, and finally the current state and critical gaps of AI for biodefense. This structure allowed me to build each section\u2019s argument on the foundation laid by the previous one, guiding the reader toward the review\u2019s central conclusion that patient-level AI biodefense represents an essential and neglected frontier.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Adopting Discipline Conventions</h3>' +
                        '<p>Styling the paper according to the submission guidelines of <em>International Security</em> was an exercise in a different kind of communication. The journal\u2019s formatting rules, from citation style and footnote conventions to heading hierarchy and manuscript structure, initially seemed like minor technicalities, but I realized adhering to them is what signals membership in a discourse community. Following these conventions is not just about \u201cgatekeeping.\u201d It facilitates communication by creating shared expectations between writer and reader. The process reinforced for me that discipline style is itself a rhetorical choice by telling the audience that the author understands and respects the norms of the conversation they are entering.</p>' +
                        '<h3 style="color:#c9a96e; margin:0 0 0.5rem;">Key Takeaways</h3>' +
                        '<p>This literature review taught me three lessons I expect to carry well beyond this course. First, writing across disciplines requires deliberate translation work. This does not encompass simplification but the careful calibration of what to define, what to assume, and how to signal that multiple communities are being addressed simultaneously. Second, in a fast-moving field, the writer\u2019s job is not just to report findings but to curate them, making transparent choices about relevance and recency so that the argument remains coherent even as its underlying evidence shifts. Third, conventions matter more than they appear to. Adopting a journal\u2019s style is an act of rhetorical positioning that shapes how seriously an audience engages with the ideas presented.</p>',
                    reflection: null,
                    image: null
                },
                {
                    title: "Artifact 2: [Title]",
                    content: "<p>[Description of artifact.]</p>",
                    reflection: "<p>[Reflection.]</p>",
                    image: null
                },
                {
                    title: "Artifact 3: [Title]",
                    content: "<p>[Description of artifact.]</p>",
                    reflection: "<p>[Reflection.]</p>",
                    image: null
                }
            ]
        }
    }
};
