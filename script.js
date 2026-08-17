/* =========================================================
   PH1 GUILD — GOOGLE SHEET MEMBER SYSTEM
   + DISCORD ANNOUNCEMENT SYSTEM
   ========================================================= */


/* =========================================================
   GOOGLE SHEETS MEMBER CONFIG
   ========================================================= */

const MEMBER_SHEET_ID =
    "14ygF1s48Yf6z2dRzf-K--L1DfqNzudIteJlsbpIfdvo";

const MEMBER_SHEET_GID =
    "1347299641";


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let members = [];

let announcements = [];

let currentAnnouncement = 0;


/* =========================================================
   DISCORD ANNOUNCEMENTS
   ========================================================= */

async function loadDiscordAnnouncements() {

    try {

        console.log(
            "Loading PH1 Discord announcements..."
        );


        const response =
            await fetch(
                "http://localhost:3000/api/announcements"
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        announcements =
            await response.json();


        /*
         * Always start with newest announcement
         */

        currentAnnouncement = 0;


        /*
         * Render announcement
         */

        renderAnnouncement();


        /*
         * Update counters
         */

        updateAnnouncementCounters();


        console.log(
            `Loaded ${announcements.length} Discord announcements.`
        );


    } catch (error) {

        console.error(
            "Failed to load Discord announcements:",
            error
        );


        const announcementList =
            document.getElementById(
                "announcementList"
            );


        if (announcementList) {

            announcementList.innerHTML = `

                <div class="announcement-empty">

                    <div class="empty-icon">
                        📢
                    </div>

                    <h3>
                        Unable to load announcements
                    </h3>

                    <p>
                        Please make sure the PH1 Discord bot
                        is running.
                    </p>

                </div>

            `;

        }


        const announcementDots =
            document.getElementById(
                "announcementDots"
            );


        if (announcementDots) {

            announcementDots.innerHTML = "";

        }

    }

}


/* =========================================================
   RENDER ANNOUNCEMENT
   ========================================================= */

function renderAnnouncement() {

    const display =
        document.getElementById(
            "announcementList"
        );


    const dots =
        document.getElementById(
            "announcementDots"
        );


    if (!display) {

        return;

    }


    /*
     * =====================================================
     * ONLY USE THE NEWEST 3 ANNOUNCEMENTS
     * =====================================================
     */

    const latest =
        announcements.slice(0, 3);


    /*
     * =====================================================
     * NO ANNOUNCEMENTS
     * =====================================================
     */

    if (!latest.length) {

        display.innerHTML = `

            <article class="announcement-featured">

                <div class="announcement-top">

                    <span class="announcement-label">
                        GUILD NEWS
                    </span>

                    <span class="announcement-date">
                        NO ANNOUNCEMENTS
                    </span>

                </div>


                <h3>
                    No announcements yet
                </h3>


                <p class="announcement-message">
                    Guild announcements will appear here.
                </p>

            </article>

        `;


        if (dots) {

            dots.innerHTML = "";

        }


        return;

    }


    /*
     * =====================================================
     * KEEP INDEX VALID
     * =====================================================
     */

    if (
        currentAnnouncement >=
        latest.length
    ) {

        currentAnnouncement = 0;

    }


    if (
        currentAnnouncement < 0
    ) {

        currentAnnouncement =
            latest.length - 1;

    }


    /*
     * =====================================================
     * CURRENT ANNOUNCEMENT
     * =====================================================
     */

    const announcement =
        latest[currentAnnouncement];


    /*
     * =====================================================
     * DATE
     * =====================================================
     */

    let date = "";


    if (announcement.timestamp) {

        const parsedDate =
            new Date(
                announcement.timestamp
            );


        if (
            !isNaN(
                parsedDate.getTime()
            )
        ) {

            date =
                parsedDate.toLocaleDateString(
                    "en-US",
                    {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric"
                    }
                );

        }

    }


    /*
     * Fallback date
     */

    if (!date) {

        date =
            announcement.date ||
            "";

    }


    /*
     * =====================================================
     * MESSAGE
     * =====================================================
     */

    let message =
        announcement.text ||
        "";


    /*
     * Remove excessive spaces
     */

    message =
        message
            .replace(/\s+/g, " ")
            .trim();


    /*
     * =====================================================
     * LIMIT MESSAGE LENGTH
     * =====================================================
     *
     * Prevent extremely long Discord messages from
     * making the announcement box huge.
     */

    if (
        message.length > 220
    ) {

        message =
            message.substring(
                0,
                220
            ) + "...";

    }


    /*
     * =====================================================
     * TITLE
     * =====================================================
     */

    const title =
        announcement.title ||
        "PH1 Guild Announcement";


    /*
     * =====================================================
     * AUTHOR
     * =====================================================
     */

    const author =
        announcement.author ||
        "PH1 Guild";


    /*
     * =====================================================
     * DISCORD LINK
     * =====================================================
     */

    let discordLink = "";


    if (
        announcement.url
    ) {

        discordLink = `

            <a
                href="${esc(announcement.url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="discord-link"
            >
                VIEW ON DISCORD →
            </a>

        `;

    }


    /*
     * =====================================================
     * RENDER ONLY ONE ANNOUNCEMENT
     * =====================================================
     */

    display.innerHTML = `

        <div class="announcement-carousel">


            <!-- PREVIOUS -->

            <button
                class="announcement-arrow"
                onclick="previousAnnouncement()"
                aria-label="Previous announcement"
                title="Previous announcement"
            >
                ‹
            </button>


            <!-- ANNOUNCEMENT -->

            <div class="announcement-display">

                <article
                    class="announcement-featured"
                >


                    <!-- TOP -->

                    <div class="announcement-top">

                        <span
                            class="announcement-label"
                        >
                            GUILD NEWS
                        </span>


                        <span
                            class="announcement-date"
                        >
                            ${esc(date)}
                        </span>

                    </div>


                    <!-- TITLE -->

                    <h3>
                        ${esc(title)}
                    </h3>


                    <!-- MESSAGE -->

                    <p
                        class="announcement-message"
                    >
                        ${esc(message)}
                    </p>


                    <!-- DIVIDER -->

                    <div
                        class="announcement-divider"
                    ></div>


                    <!-- BOTTOM -->

                    <div
                        class="announcement-bottom"
                    >

                        <span
                            class="announcement-author"
                        >

                            ⚔️

                            ${esc(author)}

                        </span>


                        ${discordLink}

                    </div>


                </article>


                <!-- DOTS -->

                <div
                    class="announcement-dots"
                    id="announcementDots"
                >

                    ${latest
                        .map(
                            (_, index) => `

                                <button
                                    class="
                                        announcement-dot
                                        ${
                                            index ===
                                            currentAnnouncement
                                                ? "active"
                                                : ""
                                        }
                                    "
                                    onclick="
                                        showAnnouncement(
                                            ${index}
                                        )
                                    "
                                    aria-label="
                                        Announcement ${
                                            index + 1
                                        }
                                    "
                                ></button>

                            `
                        )
                        .join("")}

                </div>


            </div>


            <!-- NEXT -->

            <button
                class="announcement-arrow"
                onclick="nextAnnouncement()"
                aria-label="Next announcement"
                title="Next announcement"
            >
                ›
            </button>


        </div>

    `;


    /*
     * If there is an external dots container
     * in the HTML, clear it.
     */

    if (dots) {

        dots.innerHTML = "";

    }

}


/* =========================================================
   SHOW SPECIFIC ANNOUNCEMENT
   ========================================================= */

function showAnnouncement(index) {

    const total =
        Math.min(
            announcements.length,
            3
        );


    if (!total) {

        return;

    }


    /*
     * Prevent invalid index
     */

    if (
        index < 0 ||
        index >= total
    ) {

        return;

    }


    currentAnnouncement =
        index;


    renderAnnouncement();

}


/* =========================================================
   PREVIOUS ANNOUNCEMENT
   ========================================================= */

function previousAnnouncement() {

    const total =
        Math.min(
            announcements.length,
            3
        );


    if (!total) {

        return;

    }


    currentAnnouncement--;


    if (
        currentAnnouncement < 0
    ) {

        currentAnnouncement =
            total - 1;

    }


    renderAnnouncement();

}


/* =========================================================
   NEXT ANNOUNCEMENT
   ========================================================= */

function nextAnnouncement() {

    const total =
        Math.min(
            announcements.length,
            3
        );


    if (!total) {

        return;

    }


    currentAnnouncement++;


    if (
        currentAnnouncement >= total
    ) {

        currentAnnouncement = 0;

    }


    renderAnnouncement();

}


/* =========================================================
   UPDATE ANNOUNCEMENT COUNTERS
   ========================================================= */

function updateAnnouncementCounters() {


    /*
     * Announcement count
     */

    const announcementCount =
        document.getElementById(
            "announcementCount"
        );


    if (announcementCount) {

        announcementCount.textContent =
            announcements.length;

    }


    /*
     * Event count
     */

    const eventCount =
        document.getElementById(
            "eventCount"
        );


    if (eventCount) {

        eventCount.textContent =
            announcements.filter(
                announcement =>
                    /event|war|gvg|raid/i.test(
                        (announcement.title || "") +
                        " " +
                        (announcement.text || "")
                    )
            ).length;

    }

}


/* =========================================================
   LOAD MEMBERS FROM GOOGLE SHEETS
   ========================================================= */

async function loadMembers() {

    const url =
        `https://docs.google.com/spreadsheets/d/${MEMBER_SHEET_ID}/export?format=csv&gid=${MEMBER_SHEET_GID}`;


    try {

        console.log(
            "Loading PH1 guild members..."
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Google Sheet returned HTTP ${response.status}`
            );

        }


        const csv =
            await response.text();


        members =
            parseCSV(csv);


        console.log(
            `Loaded ${members.length} guild members.`
        );


        renderMembers();


    } catch (error) {

        console.error(
            "Failed to load PH1 guild members:",
            error
        );


        members = [];


        showMemberError();

    }

}


/* =========================================================
   CSV PARSER
   ========================================================= */

function parseCSV(csv) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < csv.length;
        i++
    ) {

        const char =
            csv[i];


        if (
            char === '"'
        ) {

            if (
                insideQuotes &&
                csv[i + 1] === '"'
            ) {

                value += '"';

                i++;

            } else {

                insideQuotes =
                    !insideQuotes;

            }

        }


        else if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(
                value.trim()
            );

            value = "";

        }


        else if (
            (
                char === "\n" ||
                char === "\r"
            ) &&
            !insideQuotes
        ) {

            if (
                value !== "" ||
                row.length > 0
            ) {

                row.push(
                    value.trim()
                );


                rows.push(
                    row
                );


                row = [];

                value = "";

            }


            if (
                char === "\r" &&
                csv[i + 1] === "\n"
            ) {

                i++;

            }

        }


        else {

            value += char;

        }

    }


    /*
     * Last row
     */

    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(
            value.trim()
        );


        rows.push(
            row
        );

    }


    /*
     * =====================================================
     * FIND IGN + CLASS HEADER
     * =====================================================
     */

    let headerRowIndex = -1;

    let ignIndex = -1;

    let classIndex = -1;


    for (
        let i = 0;
        i < rows.length;
        i++
    ) {

        const headers =
            rows[i].map(
                header =>
                    header
                        .trim()
                        .toLowerCase()
            );


        const foundIgn =
            headers.findIndex(
                header =>
                    header === "ign"
            );


        const foundClass =
            headers.findIndex(
                header =>
                    header === "class"
            );


        if (
            foundIgn !== -1 &&
            foundClass !== -1
        ) {

            headerRowIndex =
                i;


            ignIndex =
                foundIgn;


            classIndex =
                foundClass;


            break;

        }

    }


    console.log(
        "PH1 header row:",
        headerRowIndex
    );


    console.log(
        "IGN column:",
        ignIndex
    );


    console.log(
        "CLASS column:",
        classIndex
    );


    /*
     * =====================================================
     * HEADER NOT FOUND
     * =====================================================
     */

    if (
        headerRowIndex === -1
    ) {

        console.error(
            "Could not find IGN + CLASS headers."
        );


        return [];

    }


    /*
     * =====================================================
     * GET MEMBERS
     * =====================================================
     */

    return rows
        .slice(
            headerRowIndex + 1
        )

        .map(
            row => {

                const name =
                    row[ignIndex]
                        ? row[ignIndex].trim()
                        : "";


                const rank =
                    row[classIndex]
                        ? row[classIndex].trim()
                        : "";


                return {

                    name:
                        name,

                    rank:
                        rank,

                    icon:
                        "⚔️"

                };

            }
        )

        .filter(
            member => {

                /*
                 * Ignore empty rows
                 */

                if (
                    !member.name
                ) {

                    return false;

                }


                /*
                 * Ignore spreadsheet totals
                 */

                if (
                    member.name
                        .toUpperCase() ===
                    "TOTAL"
                ) {

                    return false;

                }


                return true;

            }
        );

}


/* =========================================================
   RENDER MEMBERS
   ========================================================= */

function renderMembers() {


    /*
     * =====================================================
     * HOME PAGE MEMBER ROSTER
     * =====================================================
     */

    const heroMemberList =
        document.getElementById(
            "heroMemberList"
        );


    if (
        heroMemberList
    ) {

        if (
            members.length === 0
        ) {

            heroMemberList.innerHTML = `

                <div
                    class="member-loading"
                >
                    No members found.
                </div>

            `;

        }


        else {

            heroMemberList.innerHTML =
                members
                    .map(
                        member => `

                            <div
                                class="
                                    hero-member-row
                                "
                            >

                                <span
                                    class="
                                        hero-member-name
                                    "
                                >
                                    ${esc(
                                        member.name
                                    )}
                                </span>


                                <span
                                    class="
                                        hero-member-class
                                    "
                                >
                                    ${esc(
                                        member.rank
                                    )}
                                </span>

                            </div>

                        `
                    )
                    .join("");

        }

    }


    /*
     * =====================================================
     * FULL MEMBERS SECTION
     * =====================================================
     */

    const memberList =
        document.getElementById(
            "memberList"
        );


    if (
        memberList
    ) {

        if (
            members.length === 0
        ) {

            memberList.innerHTML = `

                <div
                    class="member-loading"
                >
                    No guild members found.
                </div>

            `;

        }


        else {

            memberList.innerHTML =
                members
                    .map(
                        member => `

                            <article
                                class="member"
                            >

                                <div
                                    class="avatar"
                                >
                                    ${esc(
                                        member.icon
                                    )}
                                </div>


                                <div>

                                    <h3>
                                        ${esc(
                                            member.name
                                        )}
                                    </h3>


                                    <div
                                        class="rank"
                                    >
                                        ${esc(
                                            member.rank
                                        )}
                                    </div>

                                </div>

                            </article>

                        `
                    )
                    .join("");

        }

    }


    /*
     * =====================================================
     * MEMBER COUNT
     * =====================================================
     */

    const memberCount =
        document.getElementById(
            "memberCount"
        );


    if (
        memberCount
    ) {

        memberCount.textContent =
            members.length;

    }

}


/* =========================================================
   MEMBER LOAD ERROR
   ========================================================= */

function showMemberError() {


    /*
     * HOME ROSTER
     */

    const heroMemberList =
        document.getElementById(
            "heroMemberList"
        );


    if (
        heroMemberList
    ) {

        heroMemberList.innerHTML = `

            <div
                class="member-loading"
            >
                Unable to load guild members.
            </div>

        `;

    }


    /*
     * FULL MEMBER LIST
     */

    const memberList =
        document.getElementById(
            "memberList"
        );


    if (
        memberList
    ) {

        memberList.innerHTML = `

            <div
                class="member-loading"
            >
                Unable to load guild members.
            </div>

        `;

    }


    /*
     * MEMBER COUNT
     */

    const memberCount =
        document.getElementById(
            "memberCount"
        );


    if (
        memberCount
    ) {

        memberCount.textContent =
            "0";

    }

}


/* =========================================================
   GENERAL PAGE RENDER
   ========================================================= */

function render() {


    /*
     * Announcement
     */

    renderAnnouncement();


    /*
     * Announcement counters
     */

    updateAnnouncementCounters();


    /*
     * Attendance notes
     */

    const attendanceNotes =
        document.getElementById(
            "attendanceNotes"
        );


    if (
        attendanceNotes
    ) {

        attendanceNotes.value =
            localStorage.getItem(
                "ph1_notes"
            ) || "";

    }

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function esc(s) {

    return String(
        s ?? ""
    ).replace(
        /[&<>"']/g,

        c => ({

            "&":
                "&amp;",

            "<":
                "&lt;",

            ">":
                "&gt;",

            '"':
                "&quot;",

            "'":
                "&#39;"

        }[c])

    );

}


/* =========================================================
   ANNOUNCEMENT MODAL
   ========================================================= */

function openAnnouncementModal() {

    modalType =
        "announcement";


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    if (
        modalTitle
    ) {

        modalTitle.textContent =
            "Add Announcement";

    }


    const formFields =
        document.getElementById(
            "formFields"
        );


    if (
        formFields
    ) {

        formFields.innerHTML = `

            <label>
                Title
            </label>

            <input
                name="title"
                required
            >


            <label>
                Message
            </label>

            <textarea
                name="text"
                required
            ></textarea>

        `;

    }


    const modal =
        document.getElementById(
            "modal"
        );


    if (
        modal
    ) {

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================================
   MEMBER MODAL
   ========================================================= */

/*
 * Members are controlled by Google Sheets.
 */

function openMemberModal() {

    alert(
        "Guild members are managed through the Google Sheet."
    );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (
        modal
    ) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   SUBMIT MODAL
   ========================================================= */

function submitModal(e) {

    e.preventDefault();


    const form =
        new FormData(
            e.target
        );


    /*
     * =====================================================
     * ANNOUNCEMENT
     * =====================================================
     */

    if (
        modalType ===
        "announcement"
    ) {

        announcements.unshift({

            title:
                form.get(
                    "title"
                ),

            text:
                form.get(
                    "text"
                ),

            author:
                "PH1 Guild",

            timestamp:
                new Date().toISOString()

        });


        /*
         * Keep only newest 3 for local data
         */

        announcements =
            announcements.slice(
                0,
                3
            );


        localStorage.setItem(
            "ph1_announcements",
            JSON.stringify(
                announcements
            )
        );


        currentAnnouncement =
            0;

    }


    /*
     * Reset form
     */

    e.target.reset();


    /*
     * Close modal
     */

    closeModal();


    /*
     * Refresh page content
     */

    render();

}


/* =========================================================
   DELETE ANNOUNCEMENT
   ========================================================= */

function deleteAnnouncement(i) {

    if (
        confirm(
            "Delete this announcement?"
        )
    ) {

        announcements.splice(
            i,
            1
        );


        localStorage.setItem(
            "ph1_announcements",
            JSON.stringify(
                announcements
            )
        );


        /*
         * Make sure index remains valid
         */

        if (
            currentAnnouncement >=
            announcements.length
        ) {

            currentAnnouncement = 0;

        }


        render();

    }

}


/* =========================================================
   SAVE ATTENDANCE NOTES
   ========================================================= */

function saveNotes() {

    const notes =
        document.getElementById(
            "attendanceNotes"
        );


    if (
        !notes
    ) {

        return;

    }


    localStorage.setItem(
        "ph1_notes",
        notes.value
    );


    const savedMessage =
        document.getElementById(
            "savedMessage"
        );


    if (
        savedMessage
    ) {

        savedMessage.textContent =
            "Saved locally ✓";


        setTimeout(
            () => {

                savedMessage.textContent =
                    "";

            },
            1800
        );

    }

}


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */


/*
 * Load Discord announcements
 */

loadDiscordAnnouncements();


/*
 * Render current page
 */

render();


/*
 * Load Google Sheet members
 */

loadMembers();


/*
 * Refresh Discord announcements
 * every 30 seconds.
 */

setInterval(
    loadDiscordAnnouncements,
    30000
);