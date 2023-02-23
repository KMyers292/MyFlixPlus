import React,{ useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DirectoryProvider } from './context/directory/DirectoryContext';
import { AlertProvider } from './context/alert/AlertContext';
import NavBar from './components/layout/NavBar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
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

	const handleSidebarOpen = () => {
		setSidebarOpen(!sidebarOpen);
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
					<div className={sidebarOpen ? 'main-container' : 'main-container-closed'}>
                    	<Sidebar toggleSidebar={handleSidebarOpen} isOpen={sidebarOpen} />
						<div className='results'>
							<NavBar />
							<Routes>
								<Route exact path='/' element={<LaunchPage />} />
								<Route exact path='/getStarted' element={<GettingStarted />} />
								<Route exact path='/settings' element={<Settings />} />
								<Route exact path='/results' element={<DirectorySearchResults />} />
								<Route exact path='/searched/movie/:id' element={<SearchedMovie />} />
								<Route exact path='/searched/series/:id' element={<SearchedSeries />} />
								<Route exact path='/movie/:id' element={<DirectoryMovie />} />
								<Route exact path='/series/:id' element={<DirectorySeries />} />
								<Route exact path='/unknown/:id' element={<UnknownFile />} />
							</Routes>
						</div>
					</div>
				</Router>
			</AlertProvider>
		</DirectoryProvider>
	);
};

export default App;
