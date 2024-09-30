import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Card } from 'primereact/card';
import SummaryCard from './components/SummaryCard'
import { searchResult } from './services/ApiSearchResult'
import { AutoComplete } from 'primereact/autocomplete';
import { getSummary, getResponse } from './services/ApiSummary'
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Messages } from 'primereact/messages';


function App() {
  const [articleTitles, setArticleTitles] = useState([])
  const [articleLinks, setArticleLinks] = useState([])
  const [suggestions, setSuggestions] = useState([]);
  const [inputText, setInputText] = useState('');
  const [titleAndSummary, setTitleAndSummary] = useState([])
  const [loading, isLoading] = useState(false)
  const msgs = useRef(null);

  // Step 1: Fetch the results
  const fetchApiResults = (keywords) => {
    searchResult(keywords).then(
      (data) => {
        setArticleTitles(data[1])
        setArticleLinks(data[3])
        setSuggestions([...data[1]]);
      }
    )
  }

  const search = (keyword) => {
    fetchApiResults(keyword.query)
  };

  // Step 2: When user selects an option, do all this stuff
  const operationsOnSelect = (value) => {
    let operationalValue = ''
    if (typeof value == 'string') {
      operationalValue = value
    }

    else {
      operationalValue = inputText
    }

    clearAllOptions()
    isLoading(true)
    const idx = articleTitles.indexOf(operationalValue);
    const link = articleLinks[idx];
    fetchWikipediaResults(operationalValue);
  };


  const fetchWikipediaResults = async (value) => {
    try {
      const data = await getResponse(value);
      const wikipediaResult = data.data;

      for (let i = 0; i < wikipediaResult.length; i++) {
        if (wikipediaResult[i]) {
          const summary = await fetchSummaryResults(wikipediaResult[i].actualSentences);
          setTitleAndSummary((prev) => [...prev, { title: wikipediaResult[i].title, summary: summary }]);
        }
      }
      isLoading(false)
      showMessages('success')
    } catch (error) {
      console.error("Error fetching Wikipedia results:", error);
      showMessages('error')
      clearAllOptions()
    }
  };


  const fetchSummaryResults = async (sectionText) => {
    try {
      const summary = await getSummary(sectionText);
      return summary.data
    } catch (error) {
      console.error("Error in fetchSummaryResults:", error);
    }
  };


  const clearAllOptions = () => {
    setArticleTitles([]);
    setArticleLinks([]);
    setSuggestions([]);
    setTitleAndSummary([]);
    isLoading(false);
  }


  const loadingSpinner = () => {
    return (
      <ProgressSpinner
        style={{ width: '2rem', height: '1rem' }}
        strokeWidth="8"
        animationDuration="1s"
      />
    );
  }


  const populateTextBoxWithExample = () => {
    setInputText('Khabib Nurmagomedov')
  }

  const showMessages = (type) => {
    if (msgs.current) {
      msgs.current.clear();

      if (type == 'success') {
        msgs.current.show([
          { sticky: true, life: 1000, severity: 'success', summary: 'Lessgoo', detail: 'Article summarized successfully 😀', closable: false },
        ]);
      }

      else if (type == 'error') {
        msgs.current.show([
          { sticky: true, life: 3000, severity: 'error', summary: 'Uh Oh!', detail: 'Error fetching the article. Try again 😕', closable: false },
        ]);
      }

      new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
        if (msgs.current) {
          msgs.current.clear();
        }
      });
    }
  }


  return (
    <>
      <div>
        {/* Error/Success messages */}
        <Messages ref={msgs} />

        {/* Navbar Card */}
        <Card title="🤖 gen-z wikipedia" className='center-items navbar-style'>
        </Card>

        {/* Heading */}
        <div className='center-items'>
          <div className='sub-heading-style'>
            <span className='bold-heading-font'>wikipedia, </span>
            <span>except it talks like gen-z </span>
          </div>
        </div>

        <div className='center-items'>
          <div className={loading ? 'autocomplete-style loading-link' : 'autocomplete-style'}>
            <AutoComplete
              value={inputText}
              suggestions={suggestions}
              completeMethod={(e) => search(e)}
              onSelect={(e) => {
                operationsOnSelect(e.value);
              }}
              onChange={(e) => setInputText(e.value)}
              disabled={loading}
              placeholder="Start typing or paste any wikipedia link"
              className='autocomplete-style'
              inputStyle={{ width: '100%' }}
            />
          </div>


          <div className={loading ? 'additional-links loading-link' : 'additional-links'}>
            <span onClick={populateTextBoxWithExample}>try an example</span>
          </div>


          <Button
            onClick={operationsOnSelect}
            disabled={loading}
            className='button-style'
          >
            {loading ? loadingSpinner() : 'summarize ✨'}
          </Button>

        </div>
      </div>
      <div >
        {titleAndSummary.length > 1 && <SummaryCard sections={titleAndSummary} />}
      </div>

    </>
  )
}

export default App
