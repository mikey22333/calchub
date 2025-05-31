import React, { useState } from 'react';
import { FaBook, FaRedo, FaClipboard, FaCheck } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const CitationGenerator = () => {
  const [formData, setFormData] = useState({
    sourceType: 'book',
    title: '',
    authors: '',
    publicationYear: '',
    publisher: '',
    publisherLocation: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    website: '',
    accessDate: '',
    doi: '',
    url: '',
  });
  
  const [citationStyle, setCitationStyle] = useState('apa');
  const [citation, setCitation] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Define source types with their required fields
  const sourceTypes = {
    book: {
      label: 'Book',
      requiredFields: ['title', 'authors', 'publicationYear', 'publisher', 'publisherLocation'],
      optionalFields: ['doi', 'url']
    },
    journal: {
      label: 'Journal Article',
      requiredFields: ['title', 'authors', 'publicationYear', 'journal', 'volume', 'issue', 'pages'],
      optionalFields: ['doi', 'url']
    },
    website: {
      label: 'Website',
      requiredFields: ['title', 'authors', 'publicationYear', 'website', 'url', 'accessDate'],
      optionalFields: []
    },
    newspaper: {
      label: 'Newspaper Article',
      requiredFields: ['title', 'authors', 'publicationYear', 'journal', 'pages'],
      optionalFields: ['url', 'accessDate']
    }
  };

  // Citation styles
  const citationStyles = {
    apa: { label: 'APA (7th Edition)' },
    mla: { label: 'MLA (9th Edition)' },
    chicago: { label: 'Chicago (17th Edition)' },
    harvard: { label: 'Harvard' }
  };

  // Field labels and placeholders
  const fieldLabels = {
    title: { label: 'Title', placeholder: 'Enter the title' },
    authors: { label: 'Author(s)', placeholder: 'e.g., Smith, J., & Johnson, M.' },
    publicationYear: { label: 'Publication Year', placeholder: 'e.g., 2023' },
    publisher: { label: 'Publisher', placeholder: 'e.g., Oxford University Press' },
    publisherLocation: { label: 'Publisher Location', placeholder: 'e.g., New York, NY' },
    journal: { label: 'Journal/Newspaper Name', placeholder: 'e.g., Journal of Education' },
    volume: { label: 'Volume', placeholder: 'e.g., 12' },
    issue: { label: 'Issue', placeholder: 'e.g., 3' },
    pages: { label: 'Page Range', placeholder: 'e.g., 45-67' },
    website: { label: 'Website Name', placeholder: 'e.g., Harvard Business Review' },
    accessDate: { label: 'Access Date', placeholder: 'e.g., 2023-05-31' },
    doi: { label: 'DOI', placeholder: 'e.g., 10.1000/xyz123 (optional)' },
    url: { label: 'URL', placeholder: 'e.g., https://example.com/article (optional)' }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setCitation('');
    setCopied(false);
  };

  const handleSourceTypeChange = (e) => {
    const newSourceType = e.target.value;
    setFormData({
      ...formData,
      sourceType: newSourceType
    });
    setCitation('');
    setCopied(false);
  };

  const handleCitationStyleChange = (e) => {
    setCitationStyle(e.target.value);
    setCitation('');
    setCopied(false);
  };

  const validateInputs = () => {
    setError('');
    
    const sourceType = formData.sourceType;
    const requiredFields = sourceTypes[sourceType].requiredFields;
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        setError(`Please fill in the ${fieldLabels[field].label} field`);
        return false;
      }
    }
    
    return true;
  };

  // Format authors based on citation style
  const formatAuthors = (authors, style) => {
    if (!authors) return '';
    
    // Split authors by comma and ampersand
    const authorList = authors.split(/,\s*|\s*&\s*/).filter(author => author.trim() !== '');
    
    if (style === 'apa') {
      if (authorList.length === 1) {
        return authorList[0];
      } else if (authorList.length === 2) {
        return `${authorList[0]} & ${authorList[1]}`;
      } else if (authorList.length > 2) {
        return `${authorList[0]} et al.`;
      }
    } else if (style === 'mla') {
      if (authorList.length === 1) {
        return authorList[0];
      } else if (authorList.length === 2) {
        return `${authorList[0]}, and ${authorList[1]}`;
      } else if (authorList.length > 2) {
        return `${authorList[0]}, et al.`;
      }
    } else if (style === 'chicago' || style === 'harvard') {
      if (authorList.length === 1) {
        return authorList[0];
      } else if (authorList.length === 2) {
        return `${authorList[0]} and ${authorList[1]}`;
      } else if (authorList.length === 3) {
        return `${authorList[0]}, ${authorList[1]}, and ${authorList[2]}`;
      } else if (authorList.length > 3) {
        return `${authorList[0]} et al.`;
      }
    }
    
    return authors; // Default fallback
  };

  const generateCitation = () => {
    if (!validateInputs()) {
      setCitation('');
      return;
    }
    
    let result = '';
    const {
      sourceType, title, authors, publicationYear, publisher, publisherLocation,
      journal, volume, issue, pages, website, accessDate, doi, url
    } = formData;
    
    // Format based on citation style and source type
    if (citationStyle === 'apa') {
      // APA 7th Edition
      const formattedAuthors = formatAuthors(authors, 'apa');
      
      if (sourceType === 'book') {
        result = `${formattedAuthors}. (${publicationYear}). `;
        result += `<em>${title}</em>. `;
        result += `${publisherLocation}: ${publisher}.`;
        if (doi) result += ` https://doi.org/${doi}`;
        else if (url) result += ` Retrieved from ${url}`;
      } else if (sourceType === 'journal') {
        result = `${formattedAuthors}. (${publicationYear}). `;
        result += `${title}. `;
        result += `<em>${journal}, ${volume}</em>(${issue}), ${pages}.`;
        if (doi) result += ` https://doi.org/${doi}`;
        else if (url) result += ` Retrieved from ${url}`;
      } else if (sourceType === 'website') {
        result = `${formattedAuthors}. (${publicationYear}). `;
        result += `${title}. `;
        result += `<em>${website}</em>. `;
        result += `Retrieved ${formatDate(accessDate)} from ${url}`;
      } else if (sourceType === 'newspaper') {
        result = `${formattedAuthors}. (${publicationYear}). `;
        result += `${title}. `;
        result += `<em>${journal}</em>, ${pages}.`;
        if (url) result += ` Retrieved from ${url}`;
      }
    } else if (citationStyle === 'mla') {
      // MLA 9th Edition
      const formattedAuthors = formatAuthors(authors, 'mla');
      
      if (sourceType === 'book') {
        result = `${formattedAuthors}. <em>${title}</em>. `;
        result += `${publisher}, ${publicationYear}.`;
      } else if (sourceType === 'journal') {
        result = `${formattedAuthors}. "${title}." `;
        result += `<em>${journal}</em>, vol. ${volume}, no. ${issue}, `;
        result += `${publicationYear}, pp. ${pages}.`;
        if (doi) result += ` DOI: ${doi}.`;
        else if (url) result += ` ${url}.`;
      } else if (sourceType === 'website') {
        result = `${formattedAuthors}. "${title}." `;
        result += `<em>${website}</em>, ${publicationYear}, `;
        result += `${url}. Accessed ${formatDate(accessDate)}.`;
      } else if (sourceType === 'newspaper') {
        result = `${formattedAuthors}. "${title}." `;
        result += `<em>${journal}</em>, ${publicationYear}, p. ${pages}.`;
      }
    } else if (citationStyle === 'chicago') {
      // Chicago 17th Edition
      const formattedAuthors = formatAuthors(authors, 'chicago');
      
      if (sourceType === 'book') {
        result = `${formattedAuthors}. <em>${title}</em>. `;
        result += `${publisherLocation}: ${publisher}, ${publicationYear}.`;
      } else if (sourceType === 'journal') {
        result = `${formattedAuthors}. "${title}." `;
        result += `<em>${journal}</em> ${volume}, no. ${issue} (${publicationYear}): ${pages}.`;
        if (doi) result += ` https://doi.org/${doi}.`;
      } else if (sourceType === 'website') {
        result = `${formattedAuthors}. "${title}." `;
        result += `<em>${website}</em>. ${publicationYear}. `;
        result += `${url}.`;
      } else if (sourceType === 'newspaper') {
        result = `${formattedAuthors}. "${title}." `;
        result += `<em>${journal}</em>, ${publicationYear}, ${pages}.`;
      }
    } else if (citationStyle === 'harvard') {
      // Harvard Style
      const formattedAuthors = formatAuthors(authors, 'harvard');
      
      if (sourceType === 'book') {
        result = `${formattedAuthors} (${publicationYear}) `;
        result += `<em>${title}</em>, `;
        result += `${publisherLocation}: ${publisher}.`;
      } else if (sourceType === 'journal') {
        result = `${formattedAuthors} (${publicationYear}) `;
        result += `'${title}', `;
        result += `<em>${journal}</em>, ${volume}(${issue}), pp. ${pages}.`;
        if (doi) result += ` doi: ${doi}`;
      } else if (sourceType === 'website') {
        result = `${formattedAuthors} (${publicationYear}) `;
        result += `'${title}', `;
        result += `<em>${website}</em>. Available at: ${url} `;
        result += `(Accessed: ${formatDate(accessDate)}).`;
      } else if (sourceType === 'newspaper') {
        result = `${formattedAuthors} (${publicationYear}) `;
        result += `'${title}', `;
        result += `<em>${journal}</em>, ${pages}.`;
      }
    }
    
    setCitation(result);
  };

  // Format date for citations
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      if (citationStyle === 'apa') {
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      } else if (citationStyle === 'mla') {
        return date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      } else {
        return date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      }
    } catch (_) {
      return dateString; // Return as-is if parsing fails
    }
  };

  const copyToClipboard = () => {
    // Create a temporary element to handle HTML formatting
    const tempElement = document.createElement('div');
    tempElement.innerHTML = citation;
    const plainText = tempElement.textContent || tempElement.innerText || '';
    
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setFormData({
      sourceType: 'book',
      title: '',
      authors: '',
      publicationYear: '',
      publisher: '',
      publisherLocation: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      website: '',
      accessDate: '',
      doi: '',
      url: '',
    });
    setCitation('');
    setCopied(false);
    setError('');
  };

  // Render form fields based on source type
  const renderFormFields = () => {
    const sourceType = formData.sourceType;
    const fields = [...sourceTypes[sourceType].requiredFields, ...sourceTypes[sourceType].optionalFields];
    
    return fields.map(field => (
      <div key={field} className="mb-4">
        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
          {fieldLabels[field].label} {sourceTypes[sourceType].requiredFields.includes(field) && '*'}
        </label>
        {field === 'accessDate' ? (
          <input
            type="date"
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        ) : (
          <input
            type="text"
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            placeholder={fieldLabels[field].placeholder}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        )}
      </div>
    ));
  };

  return (
    <>
      <SEO
        title="Citation Generator"
        description="Generate properly formatted citations for academic papers in APA, MLA, Chicago, and Harvard styles."
        keywords="citation generator, APA citation, MLA citation, Chicago citation, Harvard citation, academic writing, research papers, bibliography"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Citation Generator</h1>
        <p className="calculator-description">
          Generate properly formatted citations for books, journal articles, websites, and more in various academic styles.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaBook className="mr-2 text-primary-500" /> Source Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="sourceType" className="block text-sm font-medium text-gray-700 mb-1">
                  Source Type *
                </label>
                <select
                  id="sourceType"
                  name="sourceType"
                  value={formData.sourceType}
                  onChange={handleSourceTypeChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.entries(sourceTypes).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="citationStyle" className="block text-sm font-medium text-gray-700 mb-1">
                  Citation Style *
                </label>
                <select
                  id="citationStyle"
                  name="citationStyle"
                  value={citationStyle}
                  onChange={handleCitationStyleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.entries(citationStyles).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {renderFormFields()}
            
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={generateCitation}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Generate Citation
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="Reset"
            >
              <FaRedo />
            </button>
          </div>

          {citation && (
            <div className="bg-gray-100 p-4 rounded-md mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Your Citation:</h2>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-1 py-1 px-3 rounded-md ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {copied ? (
                    <>
                      <FaCheck className="text-sm" /> Copied
                    </>
                  ) : (
                    <>
                      <FaClipboard className="text-sm" /> Copy
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-300">
                <p 
                  className="text-gray-800 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: citation }}
                ></p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Citation Styles Guide</h2>
          <div className="space-y-2">
            <p>
              This generator supports the following citation styles:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>APA (7th Edition):</strong> Used primarily in social sciences</li>
              <li><strong>MLA (9th Edition):</strong> Common in humanities, especially language and literature</li>
              <li><strong>Chicago (17th Edition):</strong> Often used in history and some humanities</li>
              <li><strong>Harvard:</strong> Popular in education, business, and sciences</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2">
              Note: Always verify citations against your institution's specific requirements, as formatting may vary.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default CitationGenerator;
