 // DOM elements
 const journalList = document.getElementById('journalList');
 const locationModal = document.getElementById('locationModal');
 const journalModal = document.getElementById('journalModal');
 const journalPage = document.getElementById('journalPage');
 const closeBtn = document.querySelector('.close');
 const darkModeToggle = document.getElementById('darkModeToggle');
 const locationOptions = document.querySelectorAll('.location-option');
 const contextMenu = document.getElementById('contextMenu');
 const formattingModal = document.getElementById('formattingModal');

 // Journal entries array
 let journals = JSON.parse(localStorage.getItem('journals')) || [];

 // Current journal index
 let currentJournalIndex = -1;

 // Render journal list
 function renderJournalList() {
     journalList.innerHTML = '';
     journals.forEach((journal, index) => {
         const journalItem = document.createElement('div');
         journalItem.classList.add('journal-item');
         const title = journal.title || (journal.content ? journal.content.split(' ').slice(0, 3).join(' ') + '...' : `Journal ${index + 1}`);
         journalItem.innerHTML = `
             <h3>${title}</h3>
             <p>${new Date(journal.date).toLocaleDateString()}</p>
         `;
         journalItem.addEventListener('click', () => openJournal(index));
         journalList.appendChild(journalItem);
     });

     const newJournal = document.createElement('div');
     newJournal.classList.add('new-journal');
     newJournal.textContent = '+';
     newJournal.addEventListener('click', showLocationModal);
     journalList.appendChild(newJournal);
 }

 // Show location selection modal
 function showLocationModal() {
     locationModal.style.display = 'block';
 }

 // Create new journal
 function createNewJournal(location) {
     const newJournal = {
         content: '',
         location: location,
         date: new Date().toISOString(),
         title: ''
     };
     journals.push(newJournal);
     localStorage.setItem('journals', JSON.stringify(journals));
     renderJournalList();
     openJournal(journals.length - 1);
 }

 // Open journal
 function openJournal(index) {
     currentJournalIndex = index;
     journalPage.innerHTML = journals[index].content;
     journalModal.style.display = 'block';
     setBackground(journals[index].location);
 }

 // Close journal
 closeBtn.addEventListener('click', () => {
     saveJournal();
     journalModal.style.display = 'none';
     setBackground('default');
 });

 // Save journal
 function saveJournal() {
     if (currentJournalIndex !== -1) {
         journals[currentJournalIndex].content = journalPage.innerHTML;
         journals[currentJournalIndex].title = journalPage.innerText.split('\n')[0].trim().split(' ').slice(0, 3).join(' ');
         localStorage.setItem('journals', JSON.stringify(journals));
         renderJournalList();
     }
 }

 // Set background based on location
 function setBackground(location) {
     const backgrounds = {
         cabin: 'url("https://images.pexels.com/photos/1724228/pexels-photo-1724228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
         field: 'url("https://images.pexels.com/photos/707344/pexels-photo-707344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
         beach: 'url("https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
         default: 'none'
     };
     document.body.style.backgroundImage = backgrounds[location] || backgrounds.default;
     document.body.style.backgroundSize = 'cover';
     document.body.style.backgroundAttachment = 'fixed';
 }

 // Location selection
 locationOptions.forEach(option => {
     option.addEventListener('click', (e) => {
         const location = e.target.dataset.location;
         setBackground(location);
         locationModal.style.display = 'none';
         createNewJournal(location);
     });
 });

 // Dark mode toggle
 darkModeToggle.addEventListener('change', () => {
     document.body.classList.toggle('dark-mode');
 });

 // Context menu
 journalPage.addEventListener('contextmenu', (e) => {
     e.preventDefault();
     if (window.getSelection().toString().length === 0) {
         contextMenu.style.display = 'block';
         contextMenu.style.left = `${e.pageX}px`;
         contextMenu.style.top = `${e.pageY}px`;
     }
 });

 document.addEventListener('click', (e) => {
     if (!contextMenu.contains(e.target)) {
         contextMenu.style.display = 'none';
     }
 });

 // Prompt buttons
 document.getElementById('feelingPrompt').addEventListener('click', () => {
     insertText('Today I feel ');
     contextMenu.style.display = 'none';
 });

 document.getElementById('gratitudePrompt').addEventListener('click', () => {
     insertText('Today I\'m grateful for ');
     contextMenu.style.display = 'none';
 });

 

 // Insert text at cursor position
 function insertText(text) {
     const selection = window.getSelection();
     const range = selection.getRangeAt(0);
     const node = document.createTextNode(text);
     range.insertNode(node);
     range.setStartAfter(node);
     range.setEndAfter(node);
     selection.removeAllRanges();
     selection.addRange(range);
 }

 // Formatting modal
 journalPage.addEventListener('mouseup', (e) => {
     if (window.getSelection().toString().length > 0) {
         formattingModal.style.display = 'block';
         formattingModal.style.left = `${e.pageX}px`;
         formattingModal.style.top = `${e.pageY}px`;
     } else {
         formattingModal.style.display = 'none';
     }
 });

 // Formatting buttons
 document.getElementById('boldBtn').addEventListener('click', () => {
     document.execCommand('bold', false, null);
     formattingModal.style.display = 'none';
 });
 document.getElementById('italicBtn').addEventListener('click', () => {
     document.execCommand('italic', false, null);
     formattingModal.style.display = 'none';
    });
    document.getElementById('headingBtn').addEventListener('click', () => {
        document.execCommand('formatBlock', false, '<h2>');
        formattingModal.style.display = 'none';
    });
    document.getElementById('paragraphBtn').addEventListener('click', () => {
        document.execCommand('formatBlock', false, '<p>');
        formattingModal.style.display = 'none';
    });
    document.getElementById('blockBtn').addEventListener('click', () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const customBlock = document.createElement('div');
        customBlock.className = 'custom-block';
        range.surroundContents(customBlock);
        selection.removeAllRanges();
        selection.addRange(range);
        formattingModal.style.display = 'none';
    });
    
    journalPage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const startBlock = range.startContainer.closest('.custom-block');
            
            if (startBlock) {
                e.preventDefault();
                const newP = document.createElement('p');
                newP.innerHTML = '<br>';
                startBlock.parentNode.insertBefore(newP, startBlock.nextSibling);
                range.setStartAfter(newP);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    });

    // Close formatting modal when clicking outside
    document.addEventListener('mousedown', (e) => {
        if (!formattingModal.contains(e.target) && e.target !== formattingModal) {
            formattingModal.style.display = 'none';
        }
    });

    // Initial render
    
const pageContextMenu = document.getElementById('pageContextMenu');
const pinPageBtn = document.getElementById('pinPageBtn');
const deletePageBtn = document.getElementById('deletePageBtn');

let contextMenuTarget = null;

function showPageContextMenu(e, index) {
    e.preventDefault();
    contextMenuTarget = index;
    pageContextMenu.style.display = 'block';
    pageContextMenu.style.left = `${e.pageX}px`;
    pageContextMenu.style.top = `${e.pageY}px`;
}

function hidePageContextMenu() {
    pageContextMenu.style.display = 'none';
    contextMenuTarget = null;
}

function pinPage() {
    if (contextMenuTarget !== null) {
        const journal = journals[contextMenuTarget];
        journal.pinned = !journal.pinned;
        saveJournals();
        renderJournalList();
        hidePageContextMenu();
    }
}

function deletePage() {
    if (contextMenuTarget !== null) {
        if (confirm('Are you sure you want to delete this journal entry?')) {
            journals.splice(contextMenuTarget, 1);
            saveJournals();
            renderJournalList();
        }
        hidePageContextMenu();
    }
}

pinPageBtn.addEventListener('click', pinPage);
deletePageBtn.addEventListener('click', deletePage);

document.addEventListener('click', (e) => {
    if (!pageContextMenu.contains(e.target)) {
        hidePageContextMenu();
    }
});

// include the context menu:
function renderJournalList() {
    journalList.innerHTML = '';
    journals.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    journals.forEach((journal, index) => {
        const journalItem = document.createElement('div');
        journalItem.classList.add('journal-item');
        if (journal.pinned) journalItem.classList.add('pinned');
        const title = journal.title || (journal.content ? journal.content.split(' ').slice(0, 3).join(' ') + '...' : `Journal ${index + 1}`);
        journalItem.innerHTML = `
            <h3>${title}</h3>
            <p>${new Date(journal.date).toLocaleDateString()}</p>
        `;
        journalItem.addEventListener('click', () => openJournal(index));
        journalItem.addEventListener('contextmenu', (e) => showPageContextMenu(e, index));
        journalList.appendChild(journalItem);
    });

    const newJournal = document.createElement('div');
    newJournal.classList.add('new-journal');
    newJournal.textContent = '+';
    newJournal.addEventListener('click', showLocationModal);
    journalList.appendChild(newJournal);
}

// save journals:
function saveJournals() {
    localStorage.setItem('journals', JSON.stringify(journals));
}

// include the pinned property:
function createNewJournal(location) {
    const newJournal = {
        content: '',
        location: location,
        date: new Date().toISOString(),
        title: '',
        pinned: false
    };
    journals.push(newJournal);
    saveJournals();
    renderJournalList();
    openJournal(journals.length - 1);
}

renderJournalList();
