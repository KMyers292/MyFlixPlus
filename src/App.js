import React,{ useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DirectoryProvider } from './context/directory/DirectoryContext';
import { AlertProvider } from './context/alert/AlertContext';
import NavBar from './components/layout/NavBar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import RightSidebar from './components/layout/RightSidebar.jsx';
import HelpPage from './pages/HelpPage.jsx';
import WatchListPage from './pages/WatchListPage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import GettingStarted from './pages/GettingStarted.jsx';
import DirectorySearchResults from './pages/DirectorySearchResults.jsx';
import SearchedMovie from './pages/SearchedMovie.jsx';
import SearchedSeries from './pages/SearchedSeries.jsx';
import DirectoryMovie from './pages/DirectoryMovie.jsx';
import DirectorySeries from './pages/DirectorySeries.jsx';
import UnknownFile from './pages/UnknownFile.jsx';
import Settings from './pages/Settings.jsx';
import LaunchPage from './pages/LaunchPage.jsx';
import './assets/css/App.css';

const App = () => {

	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [sidebarRightOpen, setSidebarRightOpen] = useState(false);

	const handleSidebarOpen = () => {
		setSidebarOpen(!sidebarOpen);
	}

	const handleSidebarRightOpen = () => {
		setSidebarRightOpen(!sidebarRightOpen);
	}

	return (
		<DirectoryProvider>
			<AlertProvider>
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
					integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3'
					crossOrigin='anonymous'
				/>
				<Router>
					<div className='main-container'>
                    	<Sidebar toggleSidebar={handleSidebarOpen} isOpen={sidebarOpen} />
						<div className={sidebarOpen && sidebarRightOpen ?  'results' : sidebarOpen && !sidebarRightOpen ? 'results-right-closed' : !sidebarOpen && sidebarRightOpen ? 'results-left-closed' : 'results-both-closed'}>
							<NavBar />
							<Routes>
								<Route exact path='/' element={<LaunchPage />} />
								<Route exact path='/getStarted' element={<GettingStarted />} />
								<Route exact path='/settings' element={<Settings />} />
								<Route exact path='/help' element={<HelpPage />} />
								<Route exact path='/watchlist' element={<WatchListPage />} />
								<Route exact path='/browse' element={<BrowsePage />} />
								<Route exact path='/search' element={<SearchPage />} />
								<Route exact path='/results' element={<DirectorySearchResults />} />
								<Route exact path='/searched/movie/:id' element={<SearchedMovie />} />
								<Route exact path='/searched/series/:id' element={<SearchedSeries />} />
								<Route exact path='/movie/:id' element={<DirectoryMovie />} />
								<Route exact path='/series/:id' element={<DirectorySeries />} />
								<Route exact path='/unknown/:id' element={<UnknownFile />} />
							</Routes>
						</div>
						<RightSidebar toggleSidebar={handleSidebarRightOpen} isOpen={sidebarRightOpen} />
					</div>
				</Router>
			</AlertProvider>
		</DirectoryProvider>
	);
};

export default App;
