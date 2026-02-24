/**
 * MUSEUM DATA
 * Edit this file to update all ePortfolio content.
 * The 3D museum reads from this data to populate exhibits.
 */

const MUSEUM_DATA = {
    coverLetter: {
        title: "Welcome to My Museum",
        content: `<p>Welcome to my Museum of Science Communication — an ePortfolio for the Notation in Science Communication at Stanford University.</p>
<p>This museum is organized into three wings, each named after a fossil that represents a different era of my growth as a science communicator:</p>
<p><strong>Trilobite</strong> — Foundational work. Like the trilobite, one of Earth's earliest complex organisms, these artifacts represent my first forays into communicating science to broader audiences.</p>
<p><strong>Archaeopteryx</strong> — Transitional growth. Just as Archaeopteryx bridges dinosaurs and modern birds, these pieces show my evolution from basic science writing toward more sophisticated, multimodal communication.</p>
<p><strong>Neanderthal</strong> — Advanced engagement. Neanderthals were complex, social beings who created art and used tools — these artifacts demonstrate my most developed work in engaging diverse audiences with science.</p>
<p>I invite you to explore each wing, view the artifacts on display, and read my reflections on how each piece has shaped my journey as a science communicator.</p>
<p><em>Use WASD to walk through the museum and click on any exhibit to learn more.</em></p>`
    },

    aboutMe: {
        title: "About Me",
        content: `<p>I am a student at Stanford University pursuing the Notation in Science Communication.</p>
<p>[Add your bio, interests, academic background, and what drives your passion for science communication here.]</p>`
    },

    aboutPortfolio: {
        title: "About This ePortfolio",
        content: `<p>This ePortfolio was created as the capstone for the Notation in Science Communication (NSC) at Stanford University.</p>
<p>Rather than using a traditional platform, I built this interactive 3D museum to reflect my belief that science communication should be engaging, immersive, and accessible. The museum metaphor allows visitors to explore my work at their own pace, just as one would wander through a real museum.</p>
<p>Each wing is named after a fossil that symbolizes a stage of growth:</p>
<ul style="margin: 1rem 0; padding-left: 1.5rem;">
<li><strong>Trilobite</strong> — Early, foundational work</li>
<li><strong>Archaeopteryx</strong> — Transitional pieces showing growth</li>
<li><strong>Neanderthal</strong> — Advanced, complex engagement</li>
</ul>
<p>The artifacts within each wing are curated examples of my science communication work, accompanied by reflections that contextualize each piece within my learning journey.</p>`
    },

    exhibits: {
        trilobite: {
            name: "Trilobite Wing",
            subtitle: "Foundations",
            color: 0x8B7355,
            artifacts: [
                {
                    title: "Artifact 1: [Title]",
                    content: "<p>[Description of your first artifact — what it is, when you created it, and its context.]</p>",
                    reflection: "<p>[Your reflection on this artifact — what you learned, how it shaped your science communication skills, and what you would do differently.]</p>",
                    image: null
                },
                {
                    title: "Artifact 2: [Title]",
                    content: "<p>[Description of your second artifact.]</p>",
                    reflection: "<p>[Your reflection on this artifact.]</p>",
                    image: null
                },
                {
                    title: "Artifact 3: [Title]",
                    content: "<p>[Description of your third artifact.]</p>",
                    reflection: "<p>[Your reflection on this artifact.]</p>",
                    image: null
                }
            ]
        },
        archaeopteryx: {
            name: "Archaeopteryx Wing",
            subtitle: "Transition & Growth",
            color: 0x6B8E6B,
            artifacts: [
                {
                    title: "Artifact 1: [Title]",
                    content: "<p>[Description of your artifact.]</p>",
                    reflection: "<p>[Your reflection.]</p>",
                    image: null
                },
                {
                    title: "Artifact 2: [Title]",
                    content: "<p>[Description of your artifact.]</p>",
                    reflection: "<p>[Your reflection.]</p>",
                    image: null
                },
                {
                    title: "Artifact 3: [Title]",
                    content: "<p>[Description of your artifact.]</p>",
                    reflection: "<p>[Your reflection.]</p>",
                    image: null
                }
            ]
        },
        neanderthal: {
            name: "Neanderthal Wing",
            subtitle: "Advanced Engagement",
            color: 0x7B6B8E,
            artifacts: [
                {
                    title: "Artifact 1: [Title]",
                    content: "<p>[Description of your artifact.]</p>",
                    reflection: "<p>[Your reflection.]</p>",
                    image: null
                },
                {
                    title: "Artifact 2: [Title]",
                    content: "<p>[Description of your artifact.]</p>",
                    reflection: "<p>[Your reflection.]</p>",
                    image: null
                },
                {
                    title: "Artifact 3: [Title]",
                    content: "<p>[Description of your artifact.]</p>",
                    reflection: "<p>[Your reflection.]</p>",
                    image: null
                }
            ]
        }
    }
};
