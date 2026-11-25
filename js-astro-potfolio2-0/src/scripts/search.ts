function performSearch(searchTerm: string): void {
  // Clear previous search results
  clearSearchResults();
  
  // Ensure the search term is not empty
  if (!searchTerm) return;
  
  // Create a regular expression for searching
  const regex = new RegExp(searchTerm, 'gi'); // 'g' for global, 'i' for case insensitive
  
  // Search for the term within the body text
  const bodyText = document.body.innerText;
  
  // Array to store match positions
  let match: RegExpExecArray | null;
  const results: number[] = [];
  
  // Use exec to find all matches
  while ((match = regex.exec(bodyText)) !== null) {
    results.push(match.index);
  }
  
  // If we found results, highlight the search terms
  if (results.length > 0) {
    highlightSearchResults(searchTerm);
  } else {
    console.log('No matches found.');
  }
}

function highlightSearchResults(searchTerm: string): void {
  // Ensure the document body is not null or undefined
  if (document.body) {
    // Find all text nodes in the body
    const textNodes: Text[] = getTextNodes(document.body);
    
    textNodes.forEach((node: Text) => {
      const nodeText = node.nodeValue;
      if (nodeText && nodeText.match(new RegExp(searchTerm, 'gi'))) {
        // Split the node text by the search term to highlight it
        const parts: string[] = nodeText.split(new RegExp(`(${searchTerm})`, 'gi'));
        
        // Clear the current text content
        const fragment: DocumentFragment = document.createDocumentFragment();
        
        parts.forEach((part: string) => {
          if (part.match(new RegExp(searchTerm, 'gi'))) {
            // Wrap matched part with a <mark> tag
            // @ts-ignore
            const mark: HTMLMarkEunklement = document.createElement('mark');
            mark.className = 'highlight';
            mark.textContent = part;
            fragment.appendChild(mark);
          } else {
            // Add non-matching text as it is
            fragment.appendChild(document.createTextNode(part));
          }
        });
        
        // Replace the old text node with the highlighted content
        node.parentNode?.replaceChild(fragment, node);
      }
    });
  } else {
    console.log('Error: document body is not available.');
  }
}

function getTextNodes(node: Node): Text[] {
  let textNodes: Text[] = [];
  
  // If the node is a text node, add it to the list
  if (node.nodeType === 3) {
    textNodes.push(node as Text);
  }
  
  // If the node has child nodes, recurse through them
  if (node.hasChildNodes()) {
    node.childNodes.forEach((child: Node) => {
      textNodes = textNodes.concat(getTextNodes(child));
    });
  }
  
  return textNodes;
}

function clearSearchResults(): void {
  // Ensure the document body is available
  if (document.body) {
    // Find all highlighted elements
    const highlighted: NodeListOf<HTMLElement> = document.querySelectorAll('.highlight');
    highlighted.forEach((el: HTMLElement) => {
      // Safely remove the <mark> tag and keep the text content
      const parent: Node | null = el.parentNode;
      if (parent && el.outerHTML) {
        // @ts-ignore
        parent.innerHTML = parent.innerHTML.replace(el.outerHTML, el.innerText);
      }
    });
  } else {
    console.log('Error: document body is not available.');
  }
}

function clearSearch(): void {
  // Ensure the document body is available
  if (document.body) {
    // Find all elements with the 'highlight' class
    const highlightedElements: NodeListOf<HTMLElement> = document.querySelectorAll('.highlight');
    
    // Iterate over each highlighted element and remove the 'highlight' class
    highlightedElements.forEach((element: HTMLElement) => {
      // Create a new <span> element
      const span = document.createElement('span');
      
      // Copy the inner HTML (text content) of the current element into the <span>
      span.innerHTML = element.innerHTML;
      
      // Replace the element with the new <span>
      element.parentNode?.replaceChild(span, element);
    });
  } else {
    console.log('Error: document body is not available.');
  }
}

// Expose the functions globally
window.performSearch = performSearch;
window.clearSearch = clearSearch;
