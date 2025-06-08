(function() {
  'use strict';
  
  let navPane = null;
  let isVisible = false;

  // Create the navigation pane
  function createNavPane() {
    if (navPane) return;

    navPane = document.createElement('div');
    navPane.id = 'nav-pane-extension';
    navPane.innerHTML = `
      <div class="nav-pane-header">
        <h3>Navigation</h3>
        <button class="nav-pane-toggle" title="Collapse Navigation">‹</button>
      </div>
      <div class="nav-pane-search">
        <div class="search-container">
          <input type="text" id="nav-search-input" placeholder="Search headings..." />
          <button id="nav-search-btn" title="Search">🔍</button>
        </div>
      </div>
      <div class="nav-pane-content">
         <h1>AI in Drug Discovery: Summary & Insights</h1>

          <div class="section">
            <h2>Quick Summary</h2>
            <p>
              This paper provides a comprehensive overview of AI and deep learning applications in drug discovery,
              covering various stages from peptide synthesis to clinical development. While thorough, it lacks focus
              on recent advancements like generative AI models and active learning.
              <span class="highlight">Sources: pubmed.ncbi.nlm.nih.gov, unboundmedicine.com</span>
            </p>
          </div>

          <div class="section">
            <h2>Latest Developments</h2>
            <p>
              Recent advancements include deep generative models (DGMs) for <em>de novo</em> drug design, active learning
              to improve data efficiency, and AI-driven optimization of drug discovery pipelines.
              <span class="highlight">Source: pubmed.ncbi.nlm.nih.gov</span>
            </p>
          </div>

          <div class="section">
            <h2>Landscape Impact</h2>
            <p>
              <strong>Score:</strong> 6/10. The paper is published in a mid-tier journal (<em>Molecular Diversity</em>,
              Impact Factor ~2.5) and authored by researchers from Delhi Technological University.
              While informative, it lacks groundbreaking insights or extensive citations.
              <span class="highlight">Sources: pubmed.ncbi.nlm.nih.gov</span>
            </p>
          </div>

          <div class="section">
            <h2>Top 5 Relevant Articles</h2>
            <ul>
              <li><strong>Unleashing the power of generative AI in drug discovery</strong> (2024) – Focuses on DGMs for de novo drug design.</li>
              <li><strong>AI & ML Tech Driven Modern Drug Discovery and Development</strong> (2023) – Explores AI/ML applications in pharma R&D.</li>
              <li><strong>Artificial Intelligence in Drug Design</strong> (2018) – Early review on AI use in design strategies.</li>
              <li><strong>Machine Intelligence Approach for Drug Discovery</strong> (2021) – Deep learning-focused review.</li>
              <li><strong>AI in Pharmaceutical Field – A Critical Review</strong> (2021) – Analytical perspective on practical challenges.</li>
            </ul>
            <p><span class="highlight">Sources: pubmed.ncbi.nlm.nih.gov, unboundmedicine.com</span></p>
          </div>

          <div class="section">
            <h2>Top 3 Research Groups</h2>
            <ul>
              <li><strong>Gupta et al.</strong>, Delhi Technological University, India – AI and deep learning in drug discovery.</li>
              <li><strong>Lin et al.</strong>, National Taiwan University, Taiwan – Generative AI for de novo drug design.</li>
              <li><strong>Sarkar et al.</strong>, Indian Institute of Technology, India – AI and ML in drug discovery.</li>
            </ul>
          </div>

        <div class="nav-pane-list"></div>
      </div>
    `;
    
    document.body.appendChild(navPane);
    
    // Add event listeners
    const toggleBtn = navPane.querySelector('.nav-pane-toggle');
    const searchBtn = navPane.querySelector('#nav-search-btn');
    const searchInput = navPane.querySelector('#nav-search-input');
    
    toggleBtn.addEventListener('click', toggleNavPane);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
    searchInput.addEventListener('input', handleSearchInput);
    
    // Adjust body margin to make room for nav pane
    adjustBodyMargin(true);
    
    // Generate navigation items
    generateNavItems();
    
    isVisible = true;
  }

  // Generate navigation items from page headings
  function generateNavItems() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const navList = navPane.querySelector('.nav-pane-list');
    
    if (headings.length === 0) {
      navList.innerHTML = '<div class="nav-pane-empty">No headings found</div>';
      return;
    }

    let navHTML = '';
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      const id = heading.id || `nav-heading-${index}`;
      
      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id;
      }
      
      navHTML += `
        <div class="nav-item nav-level-${level}" data-target="${id}">
          <a href="#${id}">${text}</a>
        </div>
      `;
    });
    
    navList.innerHTML = navHTML;
    
    // Add click handlers for smooth scrolling
    navList.addEventListener('click', handleNavClick);
  }

  // Handle navigation item clicks
  function handleNavClick(e) {
    e.preventDefault();
    const link = e.target.closest('a');
    if (!link) return;
    
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Highlight the clicked item
      navPane.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      link.closest('.nav-item').classList.add('active');
    }
  }

  // Toggle navigation pane visibility
  function toggleNavPane() {
    const toggleBtn = navPane.querySelector('.nav-pane-toggle');
    
    if (isVisible) {
      navPane.style.transform = 'translateX(100%)';
      toggleBtn.innerHTML = '›';
      toggleBtn.title = 'Expand Navigation';
      adjustBodyMargin(false);
      isVisible = false;
    } else {
      navPane.style.transform = 'translateX(0)';
      toggleBtn.innerHTML = '‹';
      toggleBtn.title = 'Collapse Navigation';
      adjustBodyMargin(true);
      isVisible = true;
    }
  }

  // Adjust body margin to accommodate nav pane
  function adjustBodyMargin(show) {
    const body = document.body;
    const currentMargin = parseInt(window.getComputedStyle(body).marginRight) || 0;
    
    if (show) {
      body.style.marginRight = '320px';
      body.style.transition = 'margin-right 0.3s ease';
    } else {
      body.style.marginRight = '0px';
    }
    
    // Clean up transition after animation
    setTimeout(() => {
      body.style.transition = '';
    }, 300);
  }

  // Make navigation pane draggable
  function makeNavPaneDraggable() {
    const header = navPane.querySelector('.nav-pane-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = navPane.offsetLeft;
      startTop = navPane.offsetTop;
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
    });

    function drag(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      navPane.style.left = `${startLeft + deltaX}px`;
      navPane.style.top = `${startTop + deltaY}px`;
    }

    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    }
  }

  // Highlight current section while scrolling
  function highlightCurrentSection() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentHeading = null;
    
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 0) {
        currentHeading = heading;
      }
    });
    
    if (currentHeading && navPane) {
      navPane.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      const activeItem = navPane.querySelector(`[data-target="${currentHeading.id}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }
  }

  // Highlight current section while scrolling
   function highlightCurrentSection() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentHeading = null;
    
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 0) {
        currentHeading = heading;
      }
    });
    
    if (currentHeading && navPane) {
      navPane.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      const activeItem = navPane.querySelector(`[data-target="${currentHeading.id}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }
  }  // Handle search functionality
  function handleSearch() {
    const searchInput = navPane.querySelector('#nav-search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
      // Clear search - show all items
      showAllNavItems();
      return;
    }
    
    const navItems = navPane.querySelectorAll('.nav-item');
    let foundMatch = false;
    
    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = 'block';
        item.classList.add('search-match');
        foundMatch = true;
      } else {
        item.style.display = 'none';
        item.classList.remove('search-match');
      }
    });
    
    // Show message if no matches found
    let noResultsMsg = navPane.querySelector('.no-search-results');
    if (!foundMatch) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-search-results';
        noResultsMsg.textContent = `No headings found for "${searchTerm}"`;
        navPane.querySelector('.nav-pane-list').appendChild(noResultsMsg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
    
    console.log(`Search performed for: "${searchTerm}" - Found ${Array.from(navItems).filter(item => item.style.display !== 'none').length} matches`);
  }
  
  // Handle real-time search input
  function handleSearchInput() {
    const searchInput = navPane.querySelector('#nav-search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
      showAllNavItems();
      return;
    }
    
    // Perform real-time filtering
    const navItems = navPane.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = 'block';
        item.classList.add('search-match');
      } else {
        item.style.display = 'none';
        item.classList.remove('search-match');
      }
    });
    
    // Remove no results message during real-time search
    const noResultsMsg = navPane.querySelector('.no-search-results');
    if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }
  
  // Show all navigation items
  function showAllNavItems() {
    const navItems = navPane.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.style.display = 'block';
      item.classList.remove('search-match');
    });
    
    const noResultsMsg = navPane.querySelector('.no-search-results');
    if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }// Navigation Pane Content Script

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleNavPane') {
      if (navPane) {
        toggleNavPane();
      } else {
        createNavPane();
      }
    }
  });

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createNavPane);
  } else {
    createNavPane();
  }
  
  // Add scroll listener for highlighting current section
  window.addEventListener('scroll', highlightCurrentSection);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (navPane && isVisible) {
      adjustBodyMargin(true);
    }
  });
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (navPane) {
      adjustBodyMargin(false);
    }
  });
  
  // Refresh navigation when page content changes
  const observer = new MutationObserver((mutations) => {
    let shouldRefresh = false;
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        if (addedNodes.some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          node.querySelector && 
          node.querySelector('h1, h2, h3, h4, h5, h6')
        )) {
          shouldRefresh = true;
        }
      }
    });
    
    if (shouldRefresh && navPane) {
      setTimeout(generateNavItems, 500);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();