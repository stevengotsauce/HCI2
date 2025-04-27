// Storage utilities
const Storage = {
  save() {
    localStorage.setItem('confessions', JSON.stringify(confessions));
  },
  load() {
    const saved = localStorage.getItem('confessions');
    if (saved) {
      confessions = JSON.parse(saved);
    }
  },
  clear() {
    localStorage.removeItem('confessions');
    confessions = [];
  },
  saveConfessions(confessionsData) {
    localStorage.setItem('confessions', JSON.stringify(confessionsData));
  },
  saveReports(reportsData) {
    localStorage.setItem('reports', JSON.stringify(reportsData));
  },
  loadReports() {
    const saved = localStorage.getItem('reports');
    return saved ? JSON.parse(saved) : [];
  },
  saveUserVotes() {
    if (window.isLoggedIn) {
      const username = AuthSystem.currentUser?.username || 'anonymous';
      localStorage.setItem(`userVotes_${username}`, JSON.stringify(userVotes));
    }
  },
  loadUserVotes() {
    if (window.isLoggedIn) {
      const username = AuthSystem.currentUser?.username || 'anonymous';
      const savedVotes = localStorage.getItem(`userVotes_${username}`);
      userVotes = savedVotes ? JSON.parse(savedVotes) : {
        confessions: {},
        comments: {},
        replies: {}
      };
    } else {
      userVotes = {
        confessions: {},
        comments: {},
        replies: {}
      };
    }
  }
};

// Input sanitization
function sanitizeInput(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initial Data
let confessions = [
  { 
    id: "Cenphilian-Shadow789", 
    campus: "CPSU-Main", 
    text: "I've had a crush on my classmate for months but I'm too shy to say hi!", 
    tag: "❤️ Love", 
    upvotes: 5, 
    downvotes: 1, 
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    comments: [
      { id: 1, username: "User1", text: "Good luck!", upvotes: 2, downvotes: 0, timestamp: new Date(Date.now() - 3500000).toISOString(), replies: [] },
      { id: 2, username: "User2", text: "Just say hi!", upvotes: 3, downvotes: 0, timestamp: new Date(Date.now() - 3400000).toISOString(), replies: [] }
    ]
  },
  { 
    id: "Cenphilian-Mystic456", 
    campus: "CPSU-Victorias", 
    text: "The canteen ran out of food again—fix this!", 
    tag: "🤬 Rant", 
    upvotes: 8, 
    downvotes: 0, 
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    comments: [] 
  },
  {
    id: "Cenphilian-Blaze123",
    campus: "CPSU-San Carlos",
    text: "Just aced my finals after studying all night! All the coffee was worth it.",
    tag: "🎓 School Life",
    upvotes: 12,
    downvotes: 1,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    comments: [
      { id: 3, username: "User3", text: "Congrats!", upvotes: 5, downvotes: 0, timestamp: new Date(Date.now() - 86000000).toISOString(), replies: [] },
      { id: 4, username: "User4", text: "Share your study tips please!", upvotes: 3, downvotes: 0, timestamp: new Date(Date.now() - 85000000).toISOString(), replies: [] },
      { id: 5, username: "User5", text: "Which subject?", upvotes: 2, downvotes: 0, timestamp: new Date(Date.now() - 84000000).toISOString(), replies: [] }
    ]
  },
  {
    id: "Cenphilian-Nova567",
    campus: "CPSU-Main",
    text: "The wifi in the library is so slow it took me 20 minutes to load a PDF. Is this the stone age?",
    tag: "🤬 Rant",
    upvotes: 15,
    downvotes: 2,
    timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    comments: [
      { id: 6, username: "User6", text: "Same in the dorms!", upvotes: 4, downvotes: 0, timestamp: new Date(Date.now() - 43000000).toISOString(), replies: [] },
      { id: 7, username: "User7", text: "Try the admin building wifi", upvotes: 3, downvotes: 0, timestamp: new Date(Date.now() - 42000000).toISOString(), replies: [] },
      { id: 8, username: "User8", text: "It's been like this all semester", upvotes: 2, downvotes: 0, timestamp: new Date(Date.now() - 41000000).toISOString(), replies: [] }
    ]
  },
  {
    id: "Cenphilian-Echo234",
    campus: "CPSU-Hinigaran",
    text: "Our professor accidentally left his mic on during online class while talking to his cat. Cutest thing ever!",
    tag: "😂 Funny",
    upvotes: 22,
    downvotes: 0,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    comments: [
      { id: 9, username: "User9", text: "Which professor?", upvotes: 5, downvotes: 0, timestamp: new Date(Date.now() - 170000000).toISOString(), replies: [] },
      { id: 10, username: "User10", text: "I need to see this", upvotes: 3, downvotes: 0, timestamp: new Date(Date.now() - 160000000).toISOString(), replies: [] },
      { id: 11, username: "User11", text: "My prof's dog barked through the entire lecture yesterday 😂", upvotes: 2, downvotes: 0, timestamp: new Date(Date.now() - 150000000).toISOString(), replies: [] }
    ]
  }
];

// State Management
// Remove the local isLoggedIn variable and use window.isLoggedIn instead
if (typeof window.isLoggedIn === 'undefined') {
  window.isLoggedIn = false;
}
let currentFilter = "all";
let darkMode = localStorage.getItem("darkMode") === "enabled";

// Add these constants at the top with other state variables
const POSTS_PER_PAGE = 10;
let currentPage = 1;

// Add loading state
let isLoading = false;

// Add to state management section
const UserPreferences = {
  save(prefs) {
    localStorage.setItem('userPrefs', JSON.stringify(prefs));
  },
  load() {
    return JSON.parse(localStorage.getItem('userPrefs')) || {
      theme: 'light',
      fontSize: 'medium',
      notificationsEnabled: true
    };
  }
};

// Add to state management section
let currentSearch = '';

// Add reports array after initial data
let reports = Storage.loadReports();

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const postBtn = document.getElementById("post-btn");
const postModal = document.getElementById("post-modal");
const closeModal = document.getElementById("close-modal");
const confessionText = document.getElementById("confession-text");
const charCount = document.getElementById("char-count");
const submitConfession = document.getElementById("submit-confession");
const campusFilter = document.getElementById("campus-filter");
const campusSelect = document.getElementById("campus-select");
const tagSelect = document.getElementById("tag-select");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const confessionFeed = document.getElementById("confession-feed");
const trendingFeed = document.getElementById("trending-feed");
const leaderboardList = document.getElementById("leaderboard-list");

// Add to DOM Elements
const searchInput = document.getElementById("confession-search");

// Initialize
function init() {
  // Set initial dark mode state
  if (darkMode) {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Hide post button if not logged in
  postBtn.style.display = window.isLoggedIn ? "flex" : "none";
  
  // Make sure confessions are properly loaded and sorted
  if (!confessions || confessions.length === 0) {
    console.log("No confessions found in storage, loading initial data");
    // If no stored confessions, we'll use the initial data defined earlier
  }
  
  // Sort confessions by timestamp (newest first)
  confessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  console.log(`Loaded ${confessions.length} confessions`);
  
  // Load user votes
  Storage.loadUserVotes();
  
  // Add nested reply styles
  addNestedReplyStyles();
  
  // Set initial state
  currentFilter = "all";
  currentPage = 1;
  currentSearch = '';
  
  // Setup event listeners first
  setupEventListeners();

  // Setup campus filter
  setupCampusFilter();
  
  // Initial displays - do this last after everything is set up
  displayConfessions("all");
  displayTrending();
  displayDailyHighlights();
  displayLeaderboard();
}

// Helper Functions
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  } else {
    return "Just now";
  }
}

// Enhanced display functions
function displayConfessions(filter = "all") {
  const feed = document.getElementById("confession-feed");

  if (!feed) return; // Safety check

  if (isLoading) {
    feed.innerHTML = '<div class="loading-spinner"></div>';
    return;
  }

  // Make sure confessions are sorted by timestamp before filtering
  confessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  let filteredConfessions = confessions.filter(conf => {
    // Apply campus filter
    const campusMatch = filter === "all" || conf.campus === filter;
    
    // Apply search filter if there's a search term
    const searchMatch = !currentSearch || (
      conf.text.toLowerCase().includes(currentSearch.toLowerCase()) ||
      conf.tag?.toLowerCase().includes(currentSearch.toLowerCase()) ||
      conf.campus.toLowerCase().includes(currentSearch.toLowerCase())
    );
    
    return campusMatch && searchMatch;
  });

  // Log for debugging
  console.log(`Displaying ${filteredConfessions.length} confessions with filter: ${filter}`);

  feed.innerHTML = "";

  if (filteredConfessions.length === 0) {
    feed.innerHTML = `
      <div class="no-content">
        <i class="fas fa-comment-slash fa-3x"></i>
        <p>No confessions found for this filter.</p>
        ${window.isLoggedIn ? '<p>Be the first to post one!</p>' : '<p>Log in to post a confession.</p>'}
      </div>
    `;
    return;
  }

  // Limit to current page
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedConfessions = filteredConfessions.slice(startIndex, startIndex + POSTS_PER_PAGE);

  paginatedConfessions.forEach((conf, index) => {
    const div = document.createElement("div");
    div.className = "confession fade-in";
    div.style.animationDelay = `${index * 0.1}s`;
    
    // Check if user has voted on this confession
    const confessionVote = userVotes.confessions[conf.id];
    const opUsername = conf.id; // The original poster's username

    div.innerHTML = `
      <div class="confession-header">
        <span>${conf.id}</span>
        <span class="confession-campus">${conf.campus}</span>
        ${conf.tag ? `<span class="tag ${conf.tag.split(' ')[0]}">${conf.tag}</span>` : ''}
      </div>
      <div class="confession-content">
        ${formatText(conf.text)}
      </div>
      <div class="confession-meta">
        <small>${formatTimestamp(conf.timestamp)}</small>
      </div>
      <div class="confession-actions">
        <button class="action-btn ${confessionVote === 'up' ? 'active' : ''}" onclick="upvote('${conf.id}')">
          <i class="fas fa-thumbs-up"></i> ${conf.upvotes}
        </button>
        <button class="action-btn ${confessionVote === 'down' ? 'active' : ''}" onclick="downvote('${conf.id}')">
          <i class="fas fa-thumbs-down"></i> ${conf.downvotes}
        </button>
        <button class="action-btn" onclick="toggleComments('${conf.id}')">
          <i class="fas fa-comment"></i> ${conf.comments.length}
        </button>
        <button class="action-btn report" onclick="report('${conf.id}')">
          <i class="fas fa-flag"></i> Report
        </button>
        <button class="action-btn share" onclick="shareConfession('${conf.id}')">
          <i class="fas fa-share"></i> Share
        </button>
      </div>
      <div class="comments" id="comments-${conf.id}" style="display: none;">
        <h4>Comments (${conf.comments.length})</h4>
        
        ${window.isLoggedIn 
          ? `
            <div class="comment-form">
              <textarea placeholder="Add a comment..." id="comment-text-${conf.id}" maxlength="200"></textarea>
              <button class="primary-btn" onclick="addComment('${conf.id}')">
                <i class="fas fa-paper-plane"></i> Submit
              </button>
            </div>
          ` 
          : '<p class="login-to-comment">Login to comment</p>'
        }
        
        <div class="comments-list">
          ${conf.comments.length > 0 
            ? conf.comments.map(c => {
                const mainCommentId = `main-comment-${conf.id}-${c.id}`;
                const commentVoteKey = `${conf.id}-${c.id}`;
                const commentVote = userVotes.comments[commentVoteKey];
                const isOP = generateCenphilianUsername(c.username) === opUsername;
                
                return `
                  <div class="comment">
                    <div class="comment-header">
                      <strong${isOP ? ' class="op"' : ''}>${generateCenphilianUsername(c.username)}</strong>
                      <span class="comment-timestamp">${formatTimestamp(c.timestamp)}</span>
                    </div>
                    <div class="comment-content">${formatText(c.text || "")}</div>
                    <div class="comment-actions">
                      <button class="action-btn ${commentVote === 'up' ? 'active' : ''}" onclick="upvoteComment('${conf.id}', ${c.id})">
                        <i class="fas fa-thumbs-up"></i> ${c.upvotes}
                      </button>
                      <button class="action-btn ${commentVote === 'down' ? 'active' : ''}" onclick="downvoteComment('${conf.id}', ${c.id})">
                        <i class="fas fa-thumbs-down"></i> ${c.downvotes}
                      </button>
                      <button class="action-btn" onclick="toggleReplyFormAny('${conf.id}', ${c.id}, [])">
                        <i class="fas fa-reply"></i> Reply
                      </button>
                      <button class="action-btn report" onclick="reportComment('${conf.id}', ${c.id})">
                        <i class="fas fa-flag"></i> Report
                      </button>
                    </div>
                    
                    <div class="reply-form-any" id="reply-form-${conf.id}-${c.id}-" style="display: none;">
                      <textarea placeholder="Add a reply..." id="reply-text-${conf.id}-${c.id}-" maxlength="200"></textarea>
                      <button class="primary-btn" onclick="submitReplyToAny('${conf.id}', ${c.id}, [])">
                        <i class="fas fa-paper-plane"></i>
                      </button>
                    </div>
                    
                    ${c.replies && c.replies.length > 0 
                      ? renderReplies(conf.id, c.id, c.replies)
                      : ''}
                  </div>
                `;
              }).join('')
            : '<p class="no-comments">No comments yet.</p>'
          }
        </div>
      </div>
    `;

    feed.appendChild(div);
  });

  // Add pagination if needed
  if (filteredConfessions.length > POSTS_PER_PAGE) {
    const totalPages = Math.ceil(filteredConfessions.length / POSTS_PER_PAGE);
    
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    paginationDiv.innerHTML = `
      <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
        Next <i class="fas fa-chevron-right"></i>
      </button>
    `;
    
    feed.appendChild(paginationDiv);
  }
}

function changePage(page) {
  currentPage = page;
  displayConfessions(currentFilter);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function displayTrending() {
  const trendingFeed = document.getElementById("trending-feed");
  trendingFeed.innerHTML = "";
  
  // Sort by upvotes and get top 3
  const topConfessions = [...confessions]
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, 3);
  
  if (topConfessions.length === 0) {
    trendingFeed.innerHTML = `
      <div class="no-content">
        <p>No trending confessions yet.</p>
      </div>
    `;
    return;
  }
  
  topConfessions.forEach((conf, index) => {
    const div = document.createElement("div");
    div.className = "confession trending-item pulse";
    div.style.animationDelay = `${index * 0.5}s`;
    
    div.innerHTML = `
      <div class="confession-header">
        <span><i class="fas fa-fire"></i> #${index + 1} Trending</span>
        <span class="confession-campus">${conf.campus}</span>
        ${conf.tag ? `<span class="tag ${conf.tag.split(' ')[0]}">${conf.tag}</span>` : ''}
      </div>
      
      <div class="confession-content">
        ${formatText(conf.text)}
      </div>
      
      <div class="confession-meta">
        <small>${formatTimestamp(conf.timestamp)}</small>
      </div>
      
      <div class="confession-stats">
        <span data-id="${conf.id}"><i class="fas fa-thumbs-up"></i> ${conf.upvotes}</span>
        <span><i class="fas fa-comment"></i> ${conf.comments.length}</span>
      </div>
    `;
    
    trendingFeed.appendChild(div);
  });
}

function displayLeaderboard() {
  const leaderboard = document.getElementById("leaderboard-list");
  leaderboard.innerHTML = "";
  
  // Count posts per campus
  const campusCounts = {};
  confessions.forEach(c => {
    campusCounts[c.campus] = (campusCounts[c.campus] || 0) + 1;
  });
  
  // Sort and get top 5
  const sortedCampuses = Object.entries(campusCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  if (sortedCampuses.length === 0) {
    leaderboard.innerHTML = `
      <div class="no-content">
        <p>No active campuses yet.</p>
      </div>
    `;
    return;
  }
  
  sortedCampuses.forEach(([campus, count], index) => {
    const div = document.createElement("div");
    div.className = "leaderboard-item";
    
    // Add medal emoji for top 3
    let rankIcon = '';
    if (index === 0) rankIcon = '🥇';
    else if (index === 1) rankIcon = '🥈';
    else if (index === 2) rankIcon = '🥉';
    else rankIcon = `#${index + 1}`;
    
    div.innerHTML = `
      <span class="leaderboard-rank">${rankIcon} ${campus}</span>
      <span class="leaderboard-count">${count} ${count === 1 ? 'post' : 'posts'}</span>
    `;
    
    leaderboard.appendChild(div);
  });
}

// Enhanced action functions
function upvote(id) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to upvote confessions");
    return;
  }
  
  const conf = confessions.find(c => c.id === id);
  if (!conf) return;
  
  // Check user's current vote status
  const currentVote = userVotes.confessions[id];
  
  if (currentVote === "up") {
    // User already upvoted, so remove the upvote
    conf.upvotes--;
    userVotes.confessions[id] = null;
  } else {
    // User hasn't upvoted yet
    if (currentVote === "down") {
      // User previously downvoted, remove downvote first
      conf.downvotes--;
    }
    // Add upvote
  conf.upvotes++;
    userVotes.confessions[id] = "up";
  }
  
  Storage.save();
  Storage.saveUserVotes();
  
  // Update the UI
  updateVoteButtons(id);
  
  // Update trending which depends on votes
  updateTrending();
  
  showNotification(currentVote === "up" ? "Upvote removed!" : "Upvote recorded!");
}

function downvote(id) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to downvote confessions");
    return;
  }
  
  const conf = confessions.find(c => c.id === id);
  if (!conf) return;
  
  // Check user's current vote status
  const currentVote = userVotes.confessions[id];
  
  if (currentVote === "down") {
    // User already downvoted, so remove the downvote
    conf.downvotes--;
    userVotes.confessions[id] = null;
  } else {
    // User hasn't downvoted yet
    if (currentVote === "up") {
      // User previously upvoted, remove upvote first
      conf.upvotes--;
    }
    // Add downvote
  conf.downvotes++;
    userVotes.confessions[id] = "down";
  }
  
  Storage.save();
  Storage.saveUserVotes();
  
  // Update the UI
  updateVoteButtons(id);
  
  // Update trending which depends on votes
  updateTrending();
  
  showNotification(currentVote === "down" ? "Downvote removed!" : "Downvote recorded!");
}

function toggleComments(id) {
  const commentsDiv = document.getElementById(`comments-${id}`);
  
  if (commentsDiv.style.display === "none") {
    // Close all other open comments first
    document.querySelectorAll('.comments').forEach(div => {
      if (div.id !== `comments-${id}`) {
        div.style.display = "none";
      }
    });
    
    // Open this one with animation
    commentsDiv.style.display = "block";
    commentsDiv.classList.add("fade-in");
  } else {
    commentsDiv.style.display = "none";
  }
}

// Update functions for comments
function upvoteComment(confessionId, commentId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to upvote comments");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (comment) {
    const voteKey = `${confessionId}-${commentId}`;
    const currentVote = userVotes.comments[voteKey];
    
    if (currentVote === "up") {
      // User already upvoted, so remove the upvote
      comment.upvotes--;
      userVotes.comments[voteKey] = null;
  } else {
      // User hasn't upvoted yet
      if (currentVote === "down") {
        // User previously downvoted, remove downvote first
        comment.downvotes--;
      }
      // Add upvote
      comment.upvotes++;
      userVotes.comments[voteKey] = "up";
    }
    
    Storage.save();
    Storage.saveUserVotes();
    
    // Update the UI
    updateCommentVoteButtons(confessionId, commentId);
    
    showNotification(currentVote === "up" ? "Comment upvote removed!" : "Comment upvoted!");
  }
}

function downvoteComment(confessionId, commentId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to downvote comments");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (comment) {
    const voteKey = `${confessionId}-${commentId}`;
    const currentVote = userVotes.comments[voteKey];
    
    if (currentVote === "down") {
      // User already downvoted, so remove the downvote
      comment.downvotes--;
      userVotes.comments[voteKey] = null;
    } else {
      // User hasn't downvoted yet
      if (currentVote === "up") {
        // User previously upvoted, remove upvote first
        comment.upvotes--;
      }
      // Add downvote
    comment.downvotes++;
      userVotes.comments[voteKey] = "down";
    }
    
    Storage.save();
    Storage.saveUserVotes();
    
    // Update the UI
    updateCommentVoteButtons(confessionId, commentId);
    
    showNotification(currentVote === "down" ? "Comment downvote removed!" : "Comment downvoted!");
  }
}

// Helper function to update vote buttons for a comment
function updateCommentVoteButtons(confessionId, commentId) {
  const upvoteBtn = document.querySelector(`button.action-btn[onclick="upvoteComment('${confessionId}', ${commentId})"]`);
  const downvoteBtn = document.querySelector(`button.action-btn[onclick="downvoteComment('${confessionId}', ${commentId})"]`);
  
  if (upvoteBtn && downvoteBtn) {
    const confession = confessions.find(c => c.id === confessionId);
    const comment = confession?.comments.find(c => c.id === commentId);
    const voteKey = `${confessionId}-${commentId}`;
    const currentVote = userVotes.comments[voteKey];
    
    // Update counts
    upvoteBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${comment.upvotes}`;
    downvoteBtn.innerHTML = `<i class="fas fa-thumbs-down"></i> ${comment.downvotes}`;
    
    // Update active state
    upvoteBtn.classList.toggle('active', currentVote === "up");
    downvoteBtn.classList.toggle('active', currentVote === "down");
  }
}

function report(id) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to report confessions", "warning");
    return;
  }

  showConfirmDialog({
    title: "Report Confession",
    message: "Why are you reporting this confession?",
    options: [
      "Inappropriate content",
      "Hate speech",
      "Personal information",
      "Spam",
      "Other"
    ],
    onSelect: (reason) => {
      const confession = confessions.find(c => c.id === id);
      const report = {
        confessionId: id,
        confessionText: confession.text,
        reason: reason,
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'confession'
      };
      
      reports.push(report);
      Storage.saveReports(reports);
      
      showNotification("Report submitted. Admins will review it.", "info");
    }
  });
}

// Add report function for comments
function reportComment(confessionId, commentId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to report comments", "warning");
    return;
  }

  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (!comment) return;

  showConfirmDialog({
    title: "Report Comment",
    message: "Why are you reporting this comment?",
    options: [
      "Inappropriate content",
      "Hate speech",
      "Personal information",
      "Spam",
      "Other"
    ],
    onSelect: (reason) => {
      const report = {
        confessionId: confessionId,
        commentId: commentId,
        commentText: comment.text,
        reason: reason,
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'comment'
      };
      
      reports.push(report);
      Storage.saveReports(reports);
      
      showNotification("Report submitted. Admins will review it.", "info");
    }
  });
}

// Add report function for replies
function reportReply(confessionId, commentId, replyPath) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to report replies", "warning");
    return;
  }

  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (!comment) return;
  
  // Navigate to the reply
  let currentLevel = comment.replies;
  let targetReply = null;
  
  for (let i = 0; i < replyPath.length; i++) {
    const replyId = replyPath[i];
    targetReply = currentLevel.find(r => r.id === replyId);
    
    if (!targetReply) return; // Reply path is invalid
    
    if (i === replyPath.length - 1) {
      // Found the reply to report
      showConfirmDialog({
        title: "Report Reply",
        message: "Why are you reporting this reply?",
        options: [
          "Inappropriate content",
          "Hate speech",
          "Personal information",
          "Spam",
          "Other"
        ],
        onSelect: (reason) => {
          const report = {
            confessionId: confessionId,
            commentId: commentId,
            replyId: replyId,
            replyPath: replyPath,
            replyText: targetReply.text,
            reason: reason,
            timestamp: new Date().toISOString(),
            status: 'pending',
            type: 'reply'
          };
          
          reports.push(report);
          Storage.saveReports(reports);
          
          showNotification("Report submitted. Admins will review it.", "info");
        }
      });
      return;
    }
    
    // Continue down the chain
    if (!targetReply.replies) return;
    currentLevel = targetReply.replies;
  }
}

function showNotification(message, type = "success") {
  // Remove any existing error notifications before showing a new one
  if (type === "error") {
    const existingNotifications = document.querySelectorAll('.notification.error');
    existingNotifications.forEach(notification => notification.remove());
  }
  
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  
  const icon = type === "success" ? "check-circle" :
               type === "error" ? "times-circle" :
               type === "warning" ? "exclamation-triangle" : "info-circle";
  
  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
    ${type === "error" ? '<button class="close-notification"><i class="fas fa-times"></i></button>' : ''}
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Add close button functionality for errors
  if (type === "error") {
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      });
    }
    
    // Play sound for errors if supported
    try {
      const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyM0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDQAAAAAAAAGC6fbnKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANyAKRWUMQAGHI5YwJABmFJE5EE2lYVU5EexwxNO8xRc9p01sZGy1s7L5vJb7/9R+f/p//+LO//83//xnIkVGLZGV9CJQPLWEMmIhjvb5AZI+JIRFmb/YB0SUiGYKLHo0q1L/+wSCYCgaBoGgm5vADDEDwiEQmEwgEA/E3/sAgmAoGgaBoBgMJcRgIBAIBAKBQIAgCAYBhmAYZrf9Yf/MZND/1X9aH/+pfyof/kP/5EP/BDAIDAQCAQBAQCAQDAUDAUCP/4xjEFQ8SJDKPGjACcVmcUk0VAkDQNA0DQNAsCwdB0HQdA0DQNAsGQfAEIwBA0CgAQVBMJwrCsJwdBUEQPAkBQDGwGgAAAAAACApiFIUhSFIUhyHIcg0jSHIMgYJgmCYHA0GQuDwMADgAAOAAA4AADgcDgcDgY8NwEMJ2bdvj+cex7Hse2MY/n/6nq////GNwyGYhMYUf0U7///9YeXJkVlx4XHlwoCgQDw8QBiPIpFJLH4XCYUDcbjQcC4QCQUGg0GgwZ54yMwdKFCh5TQ3D4xEIQ47/B9TlqnU1BQlGNMyo//+MYxCwXeiLNKs4YAGSkFKMzL4SdmDQPAyBoGwNgR/yVOAeBUCYEwKtYIwNASAcAoAwCgG/7H/GJeYyBcDoEAFA4Av/0jTAKbFgBwhB7FITBCEGYMhPFgThuG4bi9i4JAcBuH4yCcSRdFsNQ1Fwnh+HwfB4HQdB0HoecFUQRPFEYRnGkYDeLoujiJY2i0Wh0ORDDoeiKOYsjSKo8jqNQzikIAljAJQ5DcPBCEIyB+JImxPi+L46jmNo7jqOI6j0NQ3eSDPFr/7qIIgiC/+MYxA8WYeK4ALogAS5znQdBwHQchyHQUhSFIVBWCYGFsCAIAgEAWBh+C6AmAYBgGAQAgEA4JAFAEJSJEiRIkSJEAABAAQAEA+AAABAPW9b1vW9a1vW9a0tW1bVtW9b1vW9b1vW9c2ra1rW1b1vW9bVvW9a1vW9b1vW9bVva1rWtbVva1rWtbVvW9b1vW9b1vW9b1vW9b1vW9b1va1rWtrWtrW9b1vW9b1vW9b1vW9a2tatbVrWta2ve9b1vW//oxjECRMh4tgBAiABW9b1vXQdT1HU9R1HU9V1XVdR1HUdT1PU9T1PU9T1PUdT1PUdV1XVdV1XVdV1XUdV1XU9R1PU9T1PU9R1PUdT1NU1TU9T1PUdR1NU9TVNU1TVNVVVVVVTVNVVVUdR1HU1TVNU1TVVVVVVXVdV1XVdV1XV9X1fWdV1XVdV1XV9X1fV9X1nV9X1fV9X1fWdZ1nV9X1fWdb1vWdZ1nW9Z1nW9b1nW9b1vW7QrOAU');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {
      // Silently handle if sound can't be played
    }
  }
  
  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);
  
  // Determine display time based on type
  const displayTime = type === "error" ? 8000 : 3000;
  
  // Remove after delay (only for non-error notifications)
  if (type !== "error") {
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, displayTime);
  } else {
    // For errors, add a subtle pulse animation to ensure visibility
    setInterval(() => {
      notification.style.boxShadow = "0 0 20px rgba(255, 0, 0, 0.6)";
      setTimeout(() => {
        notification.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.4)";
      }, 1000);
    }, 2000);
  }
}

// Add confirmation dialog
function showConfirmDialog({ title, message, options = [], onSelect }) {
  // Remove any existing dialogs
  const existingDialogs = document.querySelectorAll('.confirm-dialog');
  existingDialogs.forEach(dialog => dialog.remove());
  
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  
  const optionsHtml = options.length 
    ? `<select id="confirm-select">
        ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
       </select>`
    : '';

  dialog.innerHTML = `
    <div class="confirm-content">
      <p class="confirm-title">${title}</p>
      <p class="confirm-message">${message}</p>
      ${optionsHtml}
      <div class="confirm-actions">
        <button class="btn-cancel">Cancel</button>
        <button class="btn-confirm">Confirm</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Show the dialog with animation
  setTimeout(() => dialog.classList.add('show'), 10);
  
  // Confirm button handler
  dialog.querySelector('.btn-confirm').addEventListener('click', () => {
    const reason = options.length 
      ? dialog.querySelector('#confirm-select').value 
      : null;
    dialog.classList.remove('show');
    setTimeout(() => {
      dialog.remove();
      onSelect(reason);
    }, 300);
  });
  
  // Cancel button handler
  dialog.querySelector('.btn-cancel').addEventListener('click', () => {
    dialog.classList.remove('show');
    setTimeout(() => dialog.remove(), 300);
  });
  
  // Click outside to close
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.classList.remove('show');
      setTimeout(() => dialog.remove(), 300);
    }
  });
  
  // Add styles if not already added
  if (!document.getElementById('confirm-dialog-styles')) {
    const style = document.createElement('style');
    style.id = 'confirm-dialog-styles';
    style.textContent = `
      .confirm-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(3px);
      }
      
      .confirm-dialog.show {
        opacity: 1;
      }
      
      .confirm-content {
        background-color: white;
        width: 90%;
        max-width: 360px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        padding: 24px;
        transform: translateY(20px);
        transition: transform 0.3s ease;
      }
      
      .confirm-dialog.show .confirm-content {
        transform: translateY(0);
      }
      
      .confirm-title {
        margin: 0 0 6px 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
        text-align: center;
      }
      
      .confirm-message {
        margin: 0 0 24px 0;
        text-align: center;
        font-size: 16px;
        color: #555;
        line-height: 1.5;
      }
      
      #confirm-select {
        width: 100%;
        padding: 12px;
        margin-bottom: 24px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
        color: #333;
        background-color: #f9f9f9;
      }
      
      #confirm-select:focus {
        outline: none;
        border-color: #0B6623;
        box-shadow: 0 0 0 2px rgba(11, 102, 35, 0.2);
      }
      
      .confirm-actions {
        display: flex;
        gap: 12px;
      }
      
      .confirm-actions button {
        flex: 1;
        padding: 14px 0;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-confirm {
        background-color: #0B6623;
        color: white;
      }
      
      .btn-confirm:hover {
        background-color: #0A5A1F;
        box-shadow: 0 4px 8px rgba(11, 102, 35, 0.2);
      }
      
      .btn-cancel {
        background-color: #f2f2f2;
        color: #333;
      }
      
      .btn-cancel:hover {
        background-color: #e5e5e5;
      }
      
      /* Dark mode styles */
      body.dark-mode .confirm-content {
        background-color: #222;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      }
      
      body.dark-mode .confirm-title {
        color: #fff;
      }
      
      body.dark-mode .confirm-message {
        color: #ddd;
      }
      
      body.dark-mode #confirm-select {
        background-color: #333;
        border-color: #444;
        color: #eee;
      }
      
      body.dark-mode .btn-cancel {
        background-color: #444;
        color: #eee;
      }
      
      body.dark-mode .btn-cancel:hover {
        background-color: #555;
      }
    `;
    document.head.appendChild(style);
  }
}

// Add share functionality
function shareConfession(id) {
  const conf = confessions.find(c => c.id === id);
  if (!conf) return;
  
  if (navigator.share) {
    navigator.share({
      title: 'CPSU Confession',
      text: conf.text,
      url: window.location.href
    }).catch(console.error);
  } else {
    // Fallback copy to clipboard
    navigator.clipboard.writeText(conf.text)
      .then(() => showNotification('Copied to clipboard!'))
      .catch(() => showNotification('Failed to copy', 'error'));
  }
}

// Add new search functionality
function searchConfessions(query) {
  const searchResults = confessions.filter(conf => 
    conf.text.toLowerCase().includes(query.toLowerCase()) ||
    conf.tag?.toLowerCase().includes(query.toLowerCase()) ||
    conf.campus.toLowerCase().includes(query.toLowerCase())
  );
  return searchResults;
}

// Add content moderation
function moderateContent(text) {
  const toxicityThreshold = 0.8;
  // Simulate toxicity check (replace with actual API)
  const toxicityScore = Math.random();
  return {
    isAcceptable: toxicityScore < toxicityThreshold,
    reason: toxicityScore >= toxicityThreshold ? "Content may be inappropriate" : null
  };
}

// Remove duplicate formatText function and update the main one
function formatText(text) {
  return String(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

// Login/Logout Functionality
// These functions are now handled by the AuthSystem module
// Left here for backward compatibility but should not be called directly
function login() {
  // Defer to AuthSystem
  if (typeof AuthSystem !== 'undefined') {
    AuthSystem.showLoginModal();
  } else {
    // Fallback to original simple login if AuthSystem is not available
    window.isLoggedIn = true;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-flex";
    postBtn.style.display = "flex";
    
    showNotification("Logged in anonymously!");
    updateAllDisplays();
  }
}

function logout() {
  // Defer to AuthSystem
  if (typeof AuthSystem !== 'undefined') {
    AuthSystem.logout();
  } else {
    // Fallback to original simple logout if AuthSystem is not available
    window.isLoggedIn = false;
    loginBtn.style.display = "inline-flex";
    logoutBtn.style.display = "none";
    postBtn.style.display = "none";
    
    showNotification("Logged out successfully!");
    updateAllDisplays();
  }
}

// Modal Functions
function openPostModal() {
  const postModal = document.getElementById("post-modal");
  if (!postModal) return;

  postModal.style.display = "flex";
  setTimeout(() => postModal.classList.add("show"), 10);
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closePostModal() {
  const postModal = document.getElementById("post-modal");
  if (!postModal) return;

  postModal.classList.remove("show");
  setTimeout(() => {
    postModal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }, 300);
}

// Ensure the 'Post Confession' button opens the modal
postBtn.addEventListener("click", openPostModal);

// Ensure the close button hides the modal
closeModal.addEventListener("click", closePostModal);

// Close modal when clicking outside of it
window.addEventListener("click", (e) => {
  const postModal = document.getElementById("post-modal");
  if (e.target === postModal) closePostModal();
});

// Form Submission
async function submitNewConfession() {
  if (!window.isLoggedIn) {
    showNotification("Please log in to post a confession", "error");
    closePostModal();
    return;
  }

  const text = sanitizeInput(confessionText.value.trim());
  const campus = campusSelect.value;
  const tag = tagSelect.value;
  
  // Validate
  if (!text) {
    showNotification("Please enter your confession", "error");
    return;
  }
  
  // Check for blocked words
  const blockedWords = ["spam", "hate", "offensive", "racist", "sexist"];
  if (blockedWords.some(word => text.toLowerCase().includes(word))) {
    showNotification("Confession rejected due to inappropriate content", "error");
    return;
  }
  
  // Check content moderation
  const moderationResult = await moderateContent(text);
  if (!moderationResult.isAcceptable) {
    showNotification(moderationResult.reason, "error");
    return;
  }
  
  // Add new confession with logged-in user's ID
  const newConfession = {
    id: AuthSystem.currentUser.username, // Use logged-in user's username
    campus: campus === "all" ? "All Campuses" : campus,
    text,
    tag,
    upvotes: 0,
    downvotes: 0,
    timestamp: new Date().toISOString(),
    comments: []
  };
  
  try {
    isLoading = true;
    displayConfessions(currentFilter);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    confessions.unshift(newConfession);
    Storage.saveConfessions(confessions);
    
    closePostModal();
    updateAllDisplays();
    showNotification("Confession posted successfully!");
  } catch (error) {
    showNotification("Failed to post confession. Please try again.", "error");
  } finally {
    isLoading = false;
  }
}

// Toggle Dark Mode
function toggleDarkMode() {
  darkMode = !darkMode;
  
  if (darkMode) {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("darkMode", null);
  }
}

// Event Listeners
function setupEventListeners() {
  // Login/Logout - Auth system now handles these
  // Just keeping the event binding for backward compatibility
  if (typeof AuthSystem === 'undefined') {
    loginBtn.addEventListener("click", login);
    logoutBtn.addEventListener("click", logout);
  }
  
  // Post Button
  postBtn.addEventListener("click", openPostModal);
  
  // Modal
  closeModal.addEventListener("click", closePostModal);
  window.addEventListener("click", (e) => {
    if (e.target === postModal) closePostModal();
  });
  
  // Character Counter
  confessionText.addEventListener("input", (e) => {
    const count = e.target.value.length;
    charCount.textContent = count;
    
    // Change color when approaching limit
    if (count > 450) {
      charCount.style.color = "#FF5252";
    } else if (count > 400) {
      charCount.style.color = "#FFC107";
    } else {
      charCount.style.color = "";
    }
  });
  
  // Submit Confession
  submitConfession.addEventListener("click", submitNewConfession);
  
  // Campus Filter
  campusFilter.addEventListener("change", debounce((e) => {
    currentFilter = e.target.value;
    currentPage = 1;  // Reset to first page
    displayConfessions(currentFilter);
    
    // Add smooth scroll to recent confessions
    const feedSection = document.querySelector('.feed-section');
    if (currentFilter !== 'all' && feedSection) {
      feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 250));
  
  // Dark Mode Toggle
  darkModeToggle.addEventListener("click", toggleDarkMode);
  
  // ESC key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && postModal.style.display === "flex") {
      closePostModal();
    }
  });

  // Search functionality
  if (searchInput) {
  searchInput.addEventListener("input", debounce((e) => {
      currentSearch = e.target.value.trim();
    currentPage = 1; // Reset to first page when searching
    displayConfessions(currentFilter);
  }, 300));
    
    // Add a clear search button functionality
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        currentSearch = "";
        currentPage = 1;
        displayConfessions(currentFilter);
      }
    });
  }

  // Add scroll event listener for post button position
  document.addEventListener("scroll", () => {
    const postButton = document.querySelector(".floating-btn-option2");
    const footer = document.querySelector("footer");
  
    if (postButton && footer) {
      const footerRect = footer.getBoundingClientRect();
      const buttonRect = postButton.getBoundingClientRect();
  
      if (footerRect.top < window.innerHeight) {
        postButton.style.bottom = `${window.innerHeight - footerRect.top + 30}px`; // Adjusted bottom space
      } else {
        postButton.style.bottom = "30px"; // Adjusted default position
      }
    }
  });
}

// Add debouncing for search/filter
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Update all displays
function updateAllDisplays() {
  // Reset filters and page on full update
  currentFilter = "all";
  currentPage = 1;
  currentSearch = '';
  
  // Reset the campus filter selection
  const campusFilter = document.getElementById("campus-filter");
  if (campusFilter) {
    campusFilter.value = "all";
  }
  
  // Reset the search input
  const searchInput = document.getElementById("confession-search");
  if (searchInput) {
    searchInput.value = "";
  }
  
  // Display confessions with default filter
  displayConfessions("all");
  displayTrending();
  displayDailyHighlights();
  displayLeaderboard();
}

// Create these targeted update functions
function updateLeaderboard() {
  displayLeaderboard();
}

function updateTrending() {
  displayTrending();
}

function updateDailyHighlights() {
  displayDailyHighlights();
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 85px;  /* Increased to appear above post button */
    right: -300px; /* Start off-screen to the right */
    padding: 12px 20px;
    background-color: #4CAF50;
    color: white;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 95;    /* Below modal but above post button */
    font-size: 14px;
  }
  
  .notification.show {
    right: 50px; /* Slide in to final position */
    opacity: 1;
  }
  
  .notification.error {
    background-color: #F44336;
    bottom: auto;
    top: 70px;
    right: auto;
    left: 50%;
    transform: translate(-50%, -50px);
    font-size: 18px;
    font-weight: 500;
    padding: 20px 30px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    border: 2px solid #B71C1C;
    border-radius: 6px;
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    z-index: 10000; /* Ensure it's above everything else */
    width: 90%;
    max-width: 500px;
    text-align: center;
  }
  
  .notification.error.show {
    transform: translate(-50%, 0);
  }
  
  .notification.error i {
    font-size: 24px;
    color: #FFCDD2;
  }
  
  .close-notification {
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    transition: all 0.2s ease;
  }
  
  .close-notification:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  @keyframes shake {
    10%, 90% {
      transform: translate(-51%, 0);
    }
    
    20%, 80% {
      transform: translate(-49%, 0);
    }
    
    30%, 50%, 70% {
      transform: translate(-51%, 0);
    }
    
    40%, 60% {
      transform: translate(-49%, 0);
    }
  }
  
  .notification.warning {
    background-color: #FF9800;
  }
  
  .notification.info {
    background-color: #2196F3;
  }
  
  .no-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    color: #888;
    text-align: center;
    gap: 15px;
  }
`;
document.head.appendChild(style);

// Add daily highlights functionality
function displayDailyHighlights() {
  const highlightsFeed = document.getElementById("highlights-feed");
  highlightsFeed.innerHTML = "";
  
  // Get today's confessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysConfessions = confessions.filter(conf => {
    const confDate = new Date(conf.timestamp);
    return confDate >= today;
  })
  .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
  .slice(0, 3);
  
  if (todaysConfessions.length === 0) {
    highlightsFeed.innerHTML = `
      <div class="no-content">
        <p>No highlights for today yet.</p>
      </div>
    `;
    return;
  }
  
  todaysConfessions.forEach((conf, index) => {
    const div = document.createElement("div");
    div.className = "confession";
    
    div.innerHTML = `
      <div class="confession-header">
        <span><i class="fas fa-star"></i> #${index + 1} Today's Best</span>
        <span class="confession-campus">${conf.campus}</span>
        ${conf.tag ? `<span class="tag ${conf.tag.split(' ')[0]}">${conf.tag}</span>` : ''}
      </div>
      <div class="confession-content">${formatText(conf.text)}</div>
      <div class="confession-stats">
        <span><i class="fas fa-thumbs-up"></i> ${conf.upvotes}</span>
        <span><i class="fas fa-comment"></i> ${conf.comments.length}</span>
      </div>
    `;
    
    highlightsFeed.appendChild(div);
  });
}

// Add campus filter enhancement
function setupCampusFilter() {
  const campusFilter = document.getElementById("campus-filter");
  
  // Add "Most Active" option
  const mostActiveCampus = Object.entries(
    confessions.reduce((acc, conf) => {
      acc[conf.campus] = (acc[conf.campus] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (mostActiveCampus) {
    const option = document.createElement("option");
    option.value = mostActiveCampus;
    option.textContent = `📈 Most Active: ${mostActiveCampus}`;
    campusFilter.insertBefore(option, campusFilter.firstChild);
  }

  // Add active post count to options
  Array.from(campusFilter.options).forEach(opt => {
    if (opt.value !== "all") {
      const count = confessions.filter(c => c.campus === opt.value).length;
      opt.textContent += ` (${count})`;
    }
  });
}

// Add these functions after the existing comment functions

function upvoteComment(confessionId, commentId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to upvote comments");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (comment) {
    const voteKey = `${confessionId}-${commentId}`;
    const currentVote = userVotes.comments[voteKey];
    
    if (currentVote === "up") {
      // User already upvoted, so remove the upvote
      comment.upvotes--;
      userVotes.comments[voteKey] = null;
    } else {
      // User hasn't upvoted yet
      if (currentVote === "down") {
        // User previously downvoted, remove downvote first
        comment.downvotes--;
      }
      // Add upvote
    comment.upvotes++;
      userVotes.comments[voteKey] = "up";
    }
    
    Storage.save();
    Storage.saveUserVotes();
    
    // Update the UI
    updateCommentVoteButtons(confessionId, commentId);
    
    showNotification(currentVote === "up" ? "Comment upvote removed!" : "Comment upvoted!");
  }
}

function downvoteComment(confessionId, commentId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to downvote comments");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (comment) {
    const voteKey = `${confessionId}-${commentId}`;
    const currentVote = userVotes.comments[voteKey];
    
    if (currentVote === "down") {
      // User already downvoted, so remove the downvote
      comment.downvotes--;
      userVotes.comments[voteKey] = null;
    } else {
      // User hasn't downvoted yet
      if (currentVote === "up") {
        // User previously upvoted, remove upvote first
        comment.upvotes--;
      }
      // Add downvote
    comment.downvotes++;
      userVotes.comments[voteKey] = "down";
    }
    
    Storage.save();
    Storage.saveUserVotes();
    
    // Update the UI
    updateCommentVoteButtons(confessionId, commentId);
    
    showNotification(currentVote === "down" ? "Comment downvote removed!" : "Comment downvoted!");
  }
}

function addReplyToAny(confessionId, commentId, replyPath, text) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to reply");
    return;
  }
  
  if (!text.trim()) {
    showNotification("Please enter a reply", "error");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (!comment) return;
  
  // If it's a direct reply to a comment
  if (replyPath.length === 0) {
    const reply = {
      id: Date.now(),
      username: AuthSystem.currentUser.username,
      text,
      upvotes: 0,
      downvotes: 0,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    comment.replies.push(reply);
    Storage.save();
    
    showNotification("Reply added!");
    return;
  }
  
  // For nested replies, navigate the reply chain
  let currentLevel = comment.replies;
  let replyParent = null;
  
  for (let i = 0; i < replyPath.length; i++) {
    const replyId = replyPath[i];
    replyParent = currentLevel.find(r => r.id === replyId);
    
    if (!replyParent) return; // Reply path is invalid
    
    if (i === replyPath.length - 1) {
      // We've found the parent to add the reply to
      if (!replyParent.replies) {
        replyParent.replies = [];
      }
      
      const newReply = {
        id: Date.now(),
        username: AuthSystem.currentUser.username,
        text,
        upvotes: 0,
        downvotes: 0,
        timestamp: new Date().toISOString(),
        replies: []
      };
      
      replyParent.replies.push(newReply);
      Storage.save();
      
      showNotification("Reply added!");
      return;
    }
    
    // Continue down the chain
    if (!replyParent.replies) {
      replyParent.replies = [];
      return; // End of the chain, nowhere to go
    }
    
    currentLevel = replyParent.replies;
  }
}

function toggleReplyFormAny(confessionId, commentId, replyPath) {
  // Generate a unique ID for the form
  const formId = `reply-form-${confessionId}-${commentId}-${replyPath.join('-')}`;
  const replyForm = document.getElementById(formId);
  
  if (replyForm) {
    // Close all other reply forms first
    document.querySelectorAll('.reply-form-any').forEach(form => {
      if (form.id !== formId) {
        form.style.display = 'none';
      }
    });
    
    replyForm.style.display = replyForm.style.display === "none" ? "flex" : "none";
    
    // Focus the textarea if showing
    if (replyForm.style.display === "flex") {
      setTimeout(() => {
        const textarea = document.getElementById(`reply-text-${confessionId}-${commentId}-${replyPath.join('-')}`);
        if (textarea) textarea.focus();
      }, 100);
    }
  }
}

// Add this function after existing functions
function generateCenphilianUsername(baseUsername) {
  // Create a deterministic but "random-looking" username
  const prefixes = ["Shadow", "Mystic", "Blaze", "Nova", "Echo", "Phantom", "Spark", "Whisper", "Storm", "Zenith"];
  
  // Use the username string to generate a consistent index
  let sum = 0;
  if (baseUsername) {
    for (let i = 0; i < baseUsername.length; i++) {
      sum += baseUsername.charCodeAt(i);
    }
  } else {
    // If no username, use random
    sum = Math.floor(Math.random() * 10000);
  }
  
  const prefixIndex = sum % prefixes.length;
  const numbers = (sum % 900) + 100; // Generate 3-digit number between 100-999
  
  return `Cenphilian-${prefixes[prefixIndex]}${numbers}`;
}

// Add this function to handle nested replies
function toggleNestedReplyForm(confessionId, commentId, replyId) {
  const replyForm = document.getElementById(`nested-reply-form-${confessionId}-${commentId}-${replyId}`);
  if (replyForm) {
    // Close all other nested reply forms first
    document.querySelectorAll('.nested-reply-form').forEach(form => {
      if (form.id !== `nested-reply-form-${confessionId}-${commentId}-${replyId}`) {
        form.style.display = 'none';
      }
    });
    
    replyForm.style.display = replyForm.style.display === "none" ? "flex" : "none";
    
    // Focus the textarea if showing
    if (replyForm.style.display === "flex") {
      setTimeout(() => {
        const textarea = document.getElementById(`nested-reply-text-${confessionId}-${commentId}-${replyId}`);
        if (textarea) textarea.focus();
      }, 100);
    }
  }
}

// Add function to add a nested reply
function addNestedReply(confessionId, commentId, replyId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to reply");
    return;
  }
  
  const textArea = document.getElementById(`nested-reply-text-${confessionId}-${commentId}-${replyId}`);
  const text = sanitizeInput(textArea.value.trim());
  
  if (text) {
    const confession = confessions.find(c => c.id === confessionId);
    const comment = confession.comments.find(c => c.id === commentId);
    const reply = comment?.replies.find(r => r.id === replyId);
    
    if (reply) {
      // Initialize nested_replies array if it doesn't exist
      if (!reply.nested_replies) {
        reply.nested_replies = [];
      }
      
      const nestedReply = {
        id: Date.now(),
        username: AuthSystem.currentUser.username,
        text,
        upvotes: 0,
        downvotes: 0,
        timestamp: new Date().toISOString()
      };
      
      reply.nested_replies.push(nestedReply);
      textArea.value = "";
      updateAllDisplays();
      showNotification("Reply added!");
    }
  } else {
    showNotification("Please enter a reply", "error");
  }
}

// Add functions to handle upvoting and downvoting nested replies
function upvoteNestedReply(confessionId, commentId, replyId, nestedReplyId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to upvote replies");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession.comments.find(c => c.id === commentId);
  const reply = comment?.replies.find(r => r.id === replyId);
  const nestedReply = reply?.nested_replies?.find(nr => nr.id === nestedReplyId);
  
  if (nestedReply) {
    nestedReply.upvotes++;
    updateAllDisplays();
    showNotification("Reply upvoted!");
  }
}

function downvoteNestedReply(confessionId, commentId, replyId, nestedReplyId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to downvote replies");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession.comments.find(c => c.id === commentId);
  const reply = comment?.replies.find(r => r.id === replyId);
  const nestedReply = reply?.nested_replies?.find(nr => nr.id === nestedReplyId);
  
  if (nestedReply) {
    nestedReply.downvotes++;
    updateAllDisplays();
    showNotification("Reply downvoted!");
  }
}

// Add CSS styles for the nested reply structure
function addNestedReplyStyles() {
  if (!document.getElementById('nested-reply-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'nested-reply-styles';
    styleEl.textContent = `
      /* Base comments section styles */
      .comments {
        padding: 15px;
        border-radius: 8px;
        margin-top: 10px;
      }
      
      .comments h4 {
        margin-bottom: 15px;
        font-size: 16px;
      }
      
      .comments-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      /* Comment form styles */
      .comment-form {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        align-items: flex-start;
      }
      
      .comment-form textarea {
        flex: 1;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        resize: vertical;
        min-height: 60px;
        font-family: inherit;
      }
      
      body.dark-mode .comment-form textarea {
        background-color: #333;
        border-color: #444;
        color: #eee;
      }
      
      .login-to-comment {
        text-align: center;
        padding: 15px;
        color: #777;
        font-style: italic;
      }
      
      body.dark-mode .login-to-comment {
        color: #aaa;
      }
      
      /* Base reply styles for all levels */
      .comment, .reply {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      
      body.dark-mode .comment, 
      body.dark-mode .reply {
        background-color: #2a2a2a;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      
      .comment-header, .reply-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .comment-header strong, .reply-header strong {
        color: var(--primary-color, #0B6623);
        font-weight: 600;
      }
      
      body.dark-mode .comment-header strong, 
      body.dark-mode .reply-header strong {
        color: #4CAF50;
      }
      
      .comment-timestamp, .reply-timestamp {
        color: #777;
        font-size: 0.8em;
      }
      
      body.dark-mode .comment-timestamp, 
      body.dark-mode .reply-timestamp {
        color: #aaa;
      }
      
      .comment-content, .reply-content {
        margin-bottom: 10px;
        line-height: 1.4;
        word-break: break-word;
      }
      
      .comment-actions, .reply-actions {
        display: flex;
        gap: 12px;
        margin-top: 5px;
      }
      
      .comment-actions .action-btn, 
      .reply-actions .action-btn {
        background: none;
        border: none;
        color: #555;
        font-size: 0.9em;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }
      
      body.dark-mode .comment-actions .action-btn, 
      body.dark-mode .reply-actions .action-btn {
        color: #ccc;
      }
      
      .comment-actions .action-btn:hover, 
      .reply-actions .action-btn:hover {
        background-color: rgba(0,0,0,0.05);
      }
      
      body.dark-mode .comment-actions .action-btn:hover, 
      body.dark-mode .reply-actions .action-btn:hover {
        background-color: rgba(255,255,255,0.1);
      }
      
      /* Reply form styles for all levels */
      .reply-form-any {
        display: none;
        flex-direction: row;
        gap: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        align-items: flex-start;
      }
      
      .reply-form-any textarea {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        min-height: 40px;
        resize: vertical;
        font-family: inherit;
      }
      
      body.dark-mode .reply-form-any textarea {
        background-color: #333;
        border-color: #444;
        color: #eee;
      }
      
      /* Reply container styles */
      .replies-container {
        margin-top: 8px;
        margin-left: 15px;
        border-left: 2px solid #e0e0e0;
        padding-left: 15px;
        position: relative;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      
      body.dark-mode .replies-container {
        border-left-color: #444;
      }
      
      /* Empty state */
      .no-comments {
        text-align: center;
        color: #777;
        padding: 20px;
        font-style: italic;
      }
      
      body.dark-mode .no-comments {
        color: #aaa;
      }
      
      /* Special style for the first level of replies */
      .comment > .replies-container {
        margin-left: 15px;
      }
      
      /* Remove the left margin for deeply nested replies to prevent too much indentation */
      .replies-container .replies-container .replies-container .replies-container {
        margin-left: 5px;
      }
      
      /* Styles for toggle button */
      .toggle-replies {
        background: none;
        border: none;
        color: var(--primary-color, #0B6623);
        font-size: 0.85em;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 0;
        margin: 5px 0;
        font-weight: 500;
        transition: all 0.2s;
      }
      
      body.dark-mode .toggle-replies {
        color: #4CAF50;
      }
      
      .toggle-replies:hover {
        opacity: 0.8;
      }
      
      .toggle-replies i {
        font-size: 0.9em;
        transition: transform 0.2s;
      }
      
      .toggle-replies.collapsed i {
        transform: rotate(-90deg);
      }
      
      .replies-container.collapsed {
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 0;
        margin-bottom: 0;
        overflow: hidden;
      }
      
      .replies-summary {
        color: #777;
        font-size: 0.85em;
        margin-top: 5px;
        display: inline-block;
      }
      
      body.dark-mode .replies-summary {
        color: #aaa;
      }
    `;
    document.head.appendChild(styleEl);
  }
}

// Function to toggle reply visibility
function toggleRepliesVisibility(containerId) {
  const container = document.getElementById(containerId);
  const toggleButton = document.getElementById(`toggle-${containerId}`);
  
  if (container && toggleButton) {
    if (container.classList.contains('collapsed')) {
      // Expand replies
      container.classList.remove('collapsed');
      toggleButton.classList.remove('collapsed');
      toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i> Hide replies';
    } else {
      // Collapse replies
      container.classList.add('collapsed');
      toggleButton.classList.add('collapsed');
      toggleButton.innerHTML = '<i class="fas fa-chevron-right"></i> View replies';
    }
  }
}

// Update the renderReplies function to check if the reply is from the OP
function renderReplies(confessionId, commentId, replies, replyPath = []) {
  if (!replies || replies.length === 0) return '';
  
  const containerId = `replies-container-${confessionId}-${commentId}-${replyPath.join('-')}`;
  const confession = confessions.find(c => c.id === confessionId);
  const opUsername = confession ? confession.id : '';
  
  // Only show first reply by default if there are multiple
  const visibleReplies = replies.length > 1 ? [replies[0]] : replies;
  const hiddenReplies = replies.length > 1 ? replies.slice(1) : [];
  
  return `
    <div class="toggle-replies-container">
      <button id="toggle-${containerId}" class="toggle-replies" onclick="toggleRepliesVisibility('${containerId}')">
        <i class="fas fa-chevron-down"></i> Hide replies
      </button>
      <span class="replies-summary">${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}</span>
    </div>
    <div id="${containerId}" class="replies-container">
      <!-- First visible reply -->
      ${visibleReplies.map(reply => {
        const currentPath = [...replyPath, reply.id];
        const formattedPath = JSON.stringify(currentPath).replace(/"/g, '\\"');
        const voteKey = `${confessionId}-${commentId}-${currentPath.join('-')}`;
        const currentVote = userVotes.replies[voteKey];
        const isOP = generateCenphilianUsername(reply.username) === opUsername;
        
        return `
          <div class="reply" data-reply-id="${reply.id}">
            <div class="reply-header">
              <strong${isOP ? ' class="op"' : ''}>${generateCenphilianUsername(reply.username)}</strong>
              <span class="reply-timestamp">${formatTimestamp(reply.timestamp)}</span>
            </div>
            <div class="reply-content">${formatText(reply.text || "")}</div>
            <div class="reply-actions">
              <button class="action-btn ${currentVote === 'up' ? 'active' : ''}" 
                      onclick="upvoteReplyAny('${confessionId}', ${commentId}, ${formattedPath})">
                <i class="fas fa-thumbs-up"></i> ${reply.upvotes}
              </button>
              <button class="action-btn ${currentVote === 'down' ? 'active' : ''}" 
                      onclick="downvoteReplyAny('${confessionId}', ${commentId}, ${formattedPath})">
                <i class="fas fa-thumbs-down"></i> ${reply.downvotes}
              </button>
              <button class="action-btn" 
                      onclick="toggleReplyFormAny('${confessionId}', ${commentId}, ${formattedPath})">
                <i class="fas fa-reply"></i> Reply
              </button>
              <button class="action-btn report" 
                      onclick="reportReply('${confessionId}', ${commentId}, ${formattedPath})">
                <i class="fas fa-flag"></i> Report
              </button>
            </div>
            
            <div class="reply-form-any" id="reply-form-${confessionId}-${commentId}-${currentPath.join('-')}" style="display: none;">
              <textarea placeholder="Add a reply..." id="reply-text-${confessionId}-${commentId}-${currentPath.join('-')}" maxlength="200"></textarea>
              <button class="primary-btn" onclick="submitReplyToAny('${confessionId}', ${commentId}, ${formattedPath})">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
            
            ${reply.replies && reply.replies.length > 0 
              ? renderReplies(confessionId, commentId, reply.replies, currentPath) 
              : ''}
          </div>
        `;
      }).join('')}
      
      ${hiddenReplies.length > 0 ? `
        <!-- View more replies button -->
        <div class="view-more-replies" id="view-more-${containerId}">
          <button class="view-more-btn" onclick="showMoreReplies('${confessionId}', '${commentId}', '${replyPath.join('-')}')">
            <i class="fas fa-chevron-down"></i> View ${hiddenReplies.length} more ${hiddenReplies.length === 1 ? 'reply' : 'replies'}
          </button>
        </div>
        
        <!-- Hidden replies container -->
        <div class="hidden-replies" id="hidden-replies-${containerId}" style="display: none;">
          ${hiddenReplies.map(reply => {
            const currentPath = [...replyPath, reply.id];
            const formattedPath = JSON.stringify(currentPath).replace(/"/g, '\\"');
            const voteKey = `${confessionId}-${commentId}-${currentPath.join('-')}`;
            const currentVote = userVotes.replies[voteKey];
            const isOP = generateCenphilianUsername(reply.username) === opUsername;
            
            return `
              <div class="reply" data-reply-id="${reply.id}">
                <div class="reply-header">
                  <strong${isOP ? ' class="op"' : ''}>${generateCenphilianUsername(reply.username)}</strong>
                  <span class="reply-timestamp">${formatTimestamp(reply.timestamp)}</span>
                </div>
                <div class="reply-content">${formatText(reply.text || "")}</div>
                <div class="reply-actions">
                  <button class="action-btn ${currentVote === 'up' ? 'active' : ''}" 
                          onclick="upvoteReplyAny('${confessionId}', ${commentId}, ${formattedPath})">
                    <i class="fas fa-thumbs-up"></i> ${reply.upvotes}
                  </button>
                  <button class="action-btn ${currentVote === 'down' ? 'active' : ''}" 
                          onclick="downvoteReplyAny('${confessionId}', ${commentId}, ${formattedPath})">
                    <i class="fas fa-thumbs-down"></i> ${reply.downvotes}
                  </button>
                  <button class="action-btn" 
                          onclick="toggleReplyFormAny('${confessionId}', ${commentId}, ${formattedPath})">
                    <i class="fas fa-reply"></i> Reply
                  </button>
                  <button class="action-btn report" 
                          onclick="reportReply('${confessionId}', ${commentId}, ${formattedPath})">
                    <i class="fas fa-flag"></i> Report
                  </button>
                </div>
                
                <div class="reply-form-any" id="reply-form-${confessionId}-${commentId}-${currentPath.join('-')}" style="display: none;">
                  <textarea placeholder="Add a reply..." id="reply-text-${confessionId}-${commentId}-${currentPath.join('-')}" maxlength="200"></textarea>
                  <button class="primary-btn" onclick="submitReplyToAny('${confessionId}', ${commentId}, ${formattedPath})">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
                
                ${reply.replies && reply.replies.length > 0 
                  ? renderReplies(confessionId, commentId, reply.replies, currentPath) 
                  : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// Add a function to show more replies
function showMoreReplies(confessionId, commentId, replyPathStr) {
  const replyPath = replyPathStr ? replyPathStr.split('-') : [];
  const containerId = `replies-container-${confessionId}-${commentId}-${replyPathStr}`;
  const viewMoreBtn = document.getElementById(`view-more-${containerId}`);
  const hiddenReplies = document.getElementById(`hidden-replies-${containerId}`);
  
  if (viewMoreBtn && hiddenReplies) {
    // Hide the "View more" button
    viewMoreBtn.style.display = 'none';
    
    // Show the hidden replies with a fade-in effect
    hiddenReplies.style.display = 'block';
    hiddenReplies.style.opacity = '0';
    
    // Trigger a reflow to make the transition work
    void hiddenReplies.offsetWidth;
    
    // Fade in the hidden replies
    hiddenReplies.style.opacity = '1';
    hiddenReplies.style.transition = 'opacity 0.3s ease';
  }
}

// Add CSS for the view more button
const viewMoreStyles = document.createElement('style');
viewMoreStyles.textContent = `
  .view-more-replies {
    padding: 8px 0;
    margin: 5px 0;
    text-align: center;
  }
  
  .view-more-btn {
    background: none;
    border: none;
    color: var(--primary-color, #0B6623);
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  
  .view-more-btn:hover {
    background-color: rgba(11, 102, 35, 0.1);
  }
  
  body.dark-mode .view-more-btn {
    color: #4CAF50;
  }
  
  body.dark-mode .view-more-btn:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
  
  .hidden-replies {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;
document.head.appendChild(viewMoreStyles);

// Update the updateRepliesForComment function to properly initialize with only one reply visible
function updateRepliesForComment(confessionId, commentId) {
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (!comment) return;
  
  // Find the comment in the DOM
  const commentElement = document.querySelector(`.comment:has(button[onclick*="upvoteComment('${confessionId}', ${commentId})"])`);
  if (!commentElement) return;
  
  // Remove existing toggle-replies-container and replies-container
  const existingToggleContainer = commentElement.querySelector('.toggle-replies-container');
  if (existingToggleContainer) {
    existingToggleContainer.remove();
  }
  
  const existingRepliesContainer = commentElement.querySelector('.replies-container');
  if (existingRepliesContainer) {
    existingRepliesContainer.remove();
  }
  
  // If there are replies, render them
  if (comment.replies && comment.replies.length > 0) {
    // Find the reply form
    const replyForm = commentElement.querySelector('.reply-form-any');
    
    // Insert the new replies HTML after the reply form
  if (replyForm) {
      replyForm.insertAdjacentHTML('afterend', renderReplies(confessionId, commentId, comment.replies));
    } else {
      // If no reply form, append to the end of the comment
      commentElement.insertAdjacentHTML('beforeend', renderReplies(confessionId, commentId, comment.replies));
    }
  }
}

// Initialize the application with stored data
window.addEventListener('DOMContentLoaded', () => {
  Storage.load();
  init();
});

// Update the upvoteReplyAny function to properly update the UI
function upvoteReplyAny(confessionId, commentId, replyPath) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to upvote replies");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (!comment) return;
  
  // Navigate to the reply
  let currentLevel = comment.replies;
  let targetReply = null;
  
  for (let i = 0; i < replyPath.length; i++) {
    const replyId = replyPath[i];
    targetReply = currentLevel.find(r => r.id === replyId);
    
    if (!targetReply) return; // Reply path is invalid
    
    if (i === replyPath.length - 1) {
      // Found the reply to upvote
      const voteKey = `${confessionId}-${commentId}-${replyPath.join('-')}`;
      const currentVote = userVotes.replies[voteKey];
      
      if (currentVote === "up") {
        // User already upvoted, so remove the upvote
        targetReply.upvotes--;
        userVotes.replies[voteKey] = null;
      } else {
        // User hasn't upvoted yet
        if (currentVote === "down") {
          // User previously downvoted, remove downvote first
          targetReply.downvotes--;
        }
        // Add upvote
        targetReply.upvotes++;
        userVotes.replies[voteKey] = "up";
      }
      
      Storage.save();
      Storage.saveUserVotes();
      
      // Update the UI
      updateReplyVoteButtons(confessionId, commentId, replyPath);
      
      showNotification(currentVote === "up" ? "Reply upvote removed!" : "Reply upvoted!");
      return;
    }
    
    // Continue down the chain
    if (!targetReply.replies) return;
    currentLevel = targetReply.replies;
  }
}

// Update the downvoteReplyAny function to properly update the UI
function downvoteReplyAny(confessionId, commentId, replyPath) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to downvote replies");
    return;
  }
  
  const confession = confessions.find(c => c.id === confessionId);
  const comment = confession?.comments.find(c => c.id === commentId);
  
  if (!comment) return;
  
  // Navigate to the reply
  let currentLevel = comment.replies;
  let targetReply = null;
  
  for (let i = 0; i < replyPath.length; i++) {
    const replyId = replyPath[i];
    targetReply = currentLevel.find(r => r.id === replyId);
    
    if (!targetReply) return; // Reply path is invalid
    
    if (i === replyPath.length - 1) {
      // Found the reply to downvote
      const voteKey = `${confessionId}-${commentId}-${replyPath.join('-')}`;
      const currentVote = userVotes.replies[voteKey];
      
      if (currentVote === "down") {
        // User already downvoted, so remove the downvote
        targetReply.downvotes--;
        userVotes.replies[voteKey] = null;
      } else {
        // User hasn't downvoted yet
        if (currentVote === "up") {
          // User previously upvoted, remove upvote first
          targetReply.upvotes--;
        }
        // Add downvote
        targetReply.downvotes++;
        userVotes.replies[voteKey] = "down";
      }
      
      Storage.save();
      Storage.saveUserVotes();
      
      // Update the UI
      updateReplyVoteButtons(confessionId, commentId, replyPath);
      
      showNotification(currentVote === "down" ? "Reply downvote removed!" : "Reply downvoted!");
      return;
    }
    
    // Continue down the chain
    if (!targetReply.replies) return;
    currentLevel = targetReply.replies;
  }
}

// Helper function to update vote buttons for a confession
function updateVoteButtons(id) {
  // Get all matching buttons, as there could be multiple instances (trending, main feed)
  const upvoteBtns = document.querySelectorAll(`button.action-btn[onclick*="upvote('${id}')"]`);
  const downvoteBtns = document.querySelectorAll(`button.action-btn[onclick*="downvote('${id}')"]`);
  
  if (upvoteBtns.length > 0 && downvoteBtns.length > 0) {
    const conf = confessions.find(c => c.id === id);
    if (!conf) return;
    
    const currentVote = userVotes.confessions[id];
    
    // Update all matching buttons
    upvoteBtns.forEach(btn => {
      btn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${conf.upvotes}`;
      btn.classList.toggle('active', currentVote === "up");
    });
    
    downvoteBtns.forEach(btn => {
      btn.innerHTML = `<i class="fas fa-thumbs-down"></i> ${conf.downvotes}`;
      btn.classList.toggle('active', currentVote === "down");
    });
    
    // Also update in trending section if this post is there
    const trendingItem = document.querySelector(`.trending-item .confession-stats span:first-child[data-id="${id}"]`);
    if (trendingItem) {
      trendingItem.innerHTML = `<i class="fas fa-thumbs-up"></i> ${conf.upvotes} upvotes`;
    }
  }
}

// Add CSS for better vote button interaction
const voteButtonStyles = document.createElement('style');
voteButtonStyles.textContent = `
  .confession-actions .action-btn:first-child,
  .confession-actions .action-btn:nth-child(2) {
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .confession-actions .action-btn:first-child:hover,
  .confession-actions .action-btn:nth-child(2):hover {
    transform: translateY(-2px);
    background-color: rgba(0,0,0,0.05);
  }
  
  body.dark-mode .confession-actions .action-btn:first-child:hover,
  body.dark-mode .confession-actions .action-btn:nth-child(2):hover {
    background-color: rgba(255,255,255,0.1);
  }
  
  .confession-actions .action-btn:first-child:active,
  .confession-actions .action-btn:nth-child(2):active {
    transform: translateY(0);
  }
  
  .confession-actions .action-btn:first-child.active i {
    color: #4CAF50;
  }
  
  .confession-actions .action-btn:nth-child(2).active i {
    color: #F44336;
  }
  
  /* Create a ripple effect */
  .confession-actions .action-btn:first-child::after,
  .confession-actions .action-btn:nth-child(2)::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    opacity: 0;
    transform: scale(0);
    top: 0;
    left: 0;
    pointer-events: none;
  }
  
  .confession-actions .action-btn:first-child:active::after,
  .confession-actions .action-btn:nth-child(2):active::after {
    animation: ripple 0.6s linear;
  }
  
  @keyframes ripple {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(voteButtonStyles);

// Fix the selector in updateReplyVoteButtons function
function updateReplyVoteButtons(confessionId, commentId, replyPath) {
  // Convert replyPath to a string for comparison
  const replyPathStr = JSON.stringify(replyPath);
  
  // Select all reply vote buttons in the document
  const allUpvoteBtns = document.querySelectorAll(`.reply-actions button.action-btn:first-child`);
  const allDownvoteBtns = document.querySelectorAll(`.reply-actions button.action-btn:nth-child(2)`);
  
  // Find the specific buttons for this reply
  let upvoteBtn, downvoteBtn;
  
  allUpvoteBtns.forEach(btn => {
    if (btn.getAttribute('onclick')?.includes(`'${confessionId}'`) && 
        btn.getAttribute('onclick')?.includes(`${commentId}`) && 
        btn.getAttribute('onclick')?.includes(replyPathStr.replace(/"/g, '\\"'))) {
      upvoteBtn = btn;
    }
  });
  
  allDownvoteBtns.forEach(btn => {
    if (btn.getAttribute('onclick')?.includes(`'${confessionId}'`) && 
        btn.getAttribute('onclick')?.includes(`${commentId}`) && 
        btn.getAttribute('onclick')?.includes(replyPathStr.replace(/"/g, '\\"'))) {
      downvoteBtn = btn;
    }
  });
  
  if (upvoteBtn && downvoteBtn) {
    // Get the reply
    const confession = confessions.find(c => c.id === confessionId);
    const comment = confession?.comments.find(c => c.id === commentId);
    
    if (!comment) return;
    
    let currentLevel = comment.replies;
    let targetReply = null;
    
    for (let i = 0; i < replyPath.length; i++) {
      const replyId = replyPath[i];
      targetReply = currentLevel.find(r => r.id === replyId);
      
      if (!targetReply) return;
      
      if (i === replyPath.length - 1) {
        // Found the reply
        const voteKey = `${confessionId}-${commentId}-${replyPath.join('-')}`;
        const currentVote = userVotes.replies[voteKey];
        
        // Update counts
        upvoteBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${targetReply.upvotes}`;
        downvoteBtn.innerHTML = `<i class="fas fa-thumbs-down"></i> ${targetReply.downvotes}`;
        
        // Update active state
        upvoteBtn.classList.toggle('active', currentVote === "up");
        downvoteBtn.classList.toggle('active', currentVote === "down");
        
        return;
      }
      
      if (!targetReply.replies) return;
      currentLevel = targetReply.replies;
    }
  }
}

// Add CSS to ensure consistent username colors across posts and comments
const usernameStyleFix = document.createElement('style');
usernameStyleFix.textContent = `
  /* Make all usernames use the same color scheme */
  .confession-header span:first-child,
  .comment-header strong, 
  .reply-header strong, 
  .nested-reply-header strong {
    color: #0B6623;  /* Use the primary green color for all usernames */
    font-weight: 600;
  }
  
  body.dark-mode .confession-header span:first-child,
  body.dark-mode .comment-header strong, 
  body.dark-mode .reply-header strong, 
  body.dark-mode .nested-reply-header strong {
    color: #4CAF50;  /* Use the same green for dark mode */
  }
  
  /* Add a subtle identifier for the original poster */
  .comment-header strong.op,
  .reply-header strong.op,
  .nested-reply-header strong.op {
    position: relative;
  }
  
  .comment-header strong.op::after,
  .reply-header strong.op::after,
  .nested-reply-header strong.op::after {
    content: "OP";
    font-size: 0.7em;
    background-color: #0B6623;
    color: white;
    padding: 1px 4px;
    border-radius: 4px;
    margin-left: 5px;
    vertical-align: middle;
  }
  
  body.dark-mode .comment-header strong.op::after,
  body.dark-mode .reply-header strong.op::after,
  body.dark-mode .nested-reply-header strong.op::after {
    background-color: #4CAF50;
    color: #1a1a1a;
  }
`;
document.head.appendChild(usernameStyleFix);

// Add the comment functionality and update the related functions.
function addComment(confessionId) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to comment");
    return;
  }

  const textArea = document.getElementById(`comment-text-${confessionId}`);
  const text = sanitizeInput(textArea.value.trim());

  if (!text) {
    showNotification("Please enter a comment", "error");
    return;
  }

  const confession = confessions.find(c => c.id === confessionId);
  if (!confession) return;

  const newComment = {
    id: Date.now(),
    username: AuthSystem.currentUser.username,
    text: text,
    upvotes: 0,
    downvotes: 0,
    timestamp: new Date().toISOString(),
    replies: []
  };

  confession.comments.unshift(newComment);
  textArea.value = "";

  Storage.save();
  
  // Update the comments section
  const commentsDiv = document.getElementById(`comments-${confessionId}`);
  const commentsList = commentsDiv.querySelector('.comments-list');
  
  // Create new comment element
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment fade-in';
  commentDiv.innerHTML = `
    <div class="comment-header">
      <strong>${generateCenphilianUsername(newComment.username)}</strong>
      <span class="comment-timestamp">Just now</span>
    </div>
    <div class="comment-content">${formatText(newComment.text)}</div>
    <div class="comment-actions">
      <button class="action-btn" onclick="upvoteComment('${confessionId}', ${newComment.id})">
        <i class="fas fa-thumbs-up"></i> 0
      </button>
      <button class="action-btn" onclick="downvoteComment('${confessionId}', ${newComment.id})">
        <i class="fas fa-thumbs-down"></i> 0
      </button>
      <button class="action-btn" onclick="toggleReplyFormAny('${confessionId}', ${newComment.id}, [])">
        <i class="fas fa-reply"></i> Reply
      </button>
      <button class="action-btn report" onclick="reportComment('${confessionId}', ${newComment.id})">
        <i class="fas fa-flag"></i> Report
      </button>
    </div>
    <div class="reply-form-any" id="reply-form-${confessionId}-${newComment.id}-" style="display: none;">
      <textarea placeholder="Add a reply..." id="reply-text-${confessionId}-${newComment.id}-" maxlength="200"></textarea>
      <button class="primary-btn" onclick="submitReplyToAny('${confessionId}', ${newComment.id}, [])">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  `;

  // Insert at the beginning of the comments list
  if (commentsList.firstChild) {
    commentsList.insertBefore(commentDiv, commentsList.firstChild);
  } else {
    commentsList.appendChild(commentDiv);
  }

  // Update comment count in the confession
  const commentBtn = document.querySelector(`button.action-btn[onclick="toggleComments('${confessionId}')"]`);
  if (commentBtn) {
    commentBtn.innerHTML = `<i class="fas fa-comment"></i> ${confession.comments.length}`;
  }

  // Remove "no comments" message if it exists
  const noComments = commentsList.querySelector('.no-comments');
  if (noComments) {
    noComments.remove();
  }

  showNotification("Comment added successfully!");
}

// Add this helper function for submitting replies
function submitReplyToAny(confessionId, commentId, replyPath) {
  if (!window.isLoggedIn) {
    showNotification("Please log in to reply");
    return;
  }

  const textArea = document.getElementById(`reply-text-${confessionId}-${commentId}-${replyPath.join('-')}`);
  const text = sanitizeInput(textArea.value.trim());

  if (!text) {
    showNotification("Please enter a reply", "error");
    return;
  }

  addReplyToAny(confessionId, commentId, replyPath, text);
  textArea.value = "";

  // Close the reply form
  const replyForm = document.getElementById(`reply-form-${confessionId}-${commentId}-${replyPath.join('-')}`);
  if (replyForm) {
    replyForm.style.display = "none";
  }

  // Update the comments display
  updateRepliesForComment(confessionId, commentId);
}
