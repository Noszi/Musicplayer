import React, { Component } from 'react';
import './App.css';
import { Navbar, Playerbar, Menubar, Playlist } from './components';
import WaveSurfer from 'wavesurfer.js';
import { ipcRenderer } from 'electron';
import * as mm from 'music-metadata';
import fs from 'fs';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: '',
			duration: '',
			data: null,
			localList: {
				folder: [],
				playlist: [],
				createplaylist: []
			},
			page: 'folder',
			selected: 'folder',
			current: -1,
			playing: false,
			shuffle: false,
			repeat: false
		};
		this.pages = {
			'-3': 'createplaylist',
			'-2': 'folder',
			'-1': 'playlist'
		};
		this.wave = null;
		this.toTime = this.toTime.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.handlePrev = this.handlePrev.bind(this);
		this.handleRepeat = this.handleRepeat.bind(this);
		this.handleShuffle = this.handleShuffle.bind(this);
	}

	toTime(t) {
		var m = Math.round(t / 60);
		var s = Math.round(t % 60);
		return [ m, s ]
			.map((v) => {
				return v < 10 ? '0' + v : v;
			})
			.join(':');
	}

	handleNext() {
		var {current, selected, shuffle} = this.state;
		if (shuffle) {
			var rand = Math.floor(Math.random() * Math.floor(this.state.localList[selected].length))
			this.wave.load(this.state.localList[selected][rand]);
			this.setState({ current: rand });
		}
		else if (current + 1 < this.state.localList[selected].length) {
			this.wave.load(this.state.localList[selected][current + 1]);
			this.setState({ current: current + 1 });
		}
	}

	handlePrev() {
		var {current, selected, time, shuffle} = this.state;
		if (shuffle) {
			var rand = Math.floor(Math.random() * Math.floor(this.state.localList[selected].length))
			this.wave.load(this.state.localList[selected][rand]);
			this.setState({ current: rand });
		}
		else {
		/*if (parseInt(time.split(':')[1]) > 3) {
			this.wave.seekTo(0);
		}
		else {*/
			if (current - 1 >= 0) {
				this.wave.load(this.state.localList[selected][current - 1]);
				this.setState({ current: current - 1 });
			}
		//}	
		}
	}

	handleShuffle() { this.setState({ shuffle: !this.state.shuffle }) }
	
	handleRepeat() { this.setState({ repeat: !this.state.repeat }) }

	componentDidMount() {
		this.wave = WaveSurfer.create({
			container: document.querySelector('#wave'),
			waveColor: '#D9DCFF',
			progressColor: '#5e68a4',
			cursorColor: '#5e68a4',
			barWidth: 3,
			barRadius: 3,
			cursorWidth: 1,
			height: 30,
			barGap: 2,
			responsive: true,
			hideScrollbar: true,
			backend: 'WebAudio'
		});
		this.wave.on('ready', () => {
			this.wave.play();
			var v = this.state.localList[this.state.selected][this.state.current];
			mm.parseFile(v).then((data) => {
				data.common['name'] = v.substring(v.lastIndexOf('\\') + 1, v.indexOf('.'));
				this.setState({
					duration: this.toTime(this.wave.getDuration()),
					data: data.common,
					playing: true
				});
			});
		});
		this.wave.on('audioprocess', () => {
			this.setState({ time: this.toTime(this.wave.getCurrentTime()) });
		});
		this.wave.on('finish', () => {
			if (this.state.repeat) {
				this.wave.seekTo(0);
				this.wave.play();
			}
			else
				this.handleNext();
		})
		ipcRenderer.on('selected-files', (event, args) => {
			var obj = this.state.localList;
			obj['folder'] = [ ...obj['folder'], ...args.files ];
			this.setState({
				localList: obj
			});
		});
		ipcRenderer.send('getPlaylist');
		ipcRenderer.on('playlist', (event, args) => {
			var obj = this.state.localList;
			obj.createplaylist = args;
			this.setState({
				localList: obj
			})
		})
	}

	render() {
		var { duration, time, localList, current, data, playing, selected, page, shuffle, repeat } = this.state;
		return (
			<div className="mainContainer">
				<Navbar />
				<div className="container">
					<Menubar
						current={Object.keys(this.pages).find((key) => this.pages[key] === selected)}
						pageSelect={(i) => {
							this.setState({
								selected: this.pages[i]
							});
						}}
						setVolume={(v) => {
							this.wave.setVolume(v / 100);
						}}
					/>
					
					<Playlist
						selected={Object.keys(this.pages).find((key) => this.pages[key] === selected)}
						current={localList[page][current]}
						list={localList[selected]}
						playlist={localList['playlist']}

						
						remove={(i) => {
							var obj = this.state.localList;
							obj[selected].splice(i, 1);
							this.setState({
								localList: obj
							});
						}}
						
						
						play={(i) => {
							//if (this.state.current != i) {
							this.wave.load(this.state.localList[selected][i]);
							this.setState({
								current: i,
								page: selected
							});
							//}
						}}
						
						
						like={(i) => {
							var obj = this.state.localList;
							if (selected == 'playlist') {
								obj['playlist'].splice(index, 1);
							} else {
								var index = obj['playlist'].indexOf(obj['folder'][i]);
								if (index >= 0) obj['playlist'].splice(index, 1);
								else obj['playlist'] = [ ...obj['playlist'], obj['folder'][i] ];
							}

							this.setState({
								localList: obj
							});
						}}
						
						
						clearList={() => {
							var obj = this.state.localList;
							obj['folder'] = [];
							this.setState({
								localList: obj
							});
						}}
						
						
						clearPlaylist={() => {
							var obj = this.state.localList;
							obj['playlist'] = [];
							this.setState({
								localList: obj
							});
						}}
						
						
						deletepl={(i) => {
							ipcRenderer.send("deletepl", i);
						}}
						
						
						callpl={(i) => {
							var obj = this.state.localList;
							obj['playlist'] = JSON.parse(fs.readFileSync(`savedlist\\${i}.json`))
							this.setState({
								localList: obj
							});
						}}
						
						
						selectnone={() =>  {
							var obj = this.state.localList;
							obj['folder'].forEach(i => {
								var index = obj['playlist'].indexOf(i);
								if (index >= 0) obj['playlist'].splice(index, 1);
							});
							this.setState({
								localList: obj
							});
						}}

						
						selectall={() => {
							var obj = this.state.localList;
							obj['folder'].forEach(i => {
								var index = obj['playlist'].indexOf(i);
								if (index == -1) obj['playlist'] = [ ...obj['playlist'], i ];
							})
							this.setState({
								localList: obj
							});
						}}
						
				
						saveasplaylist={(name) => {
							ipcRenderer.send('save', {
								data: JSON.stringify(this.state.localList.playlist),
								name: name
							});
						}}
					/>
				</div>

				

				<Playerbar
					playing={playing}
					current={time}
					duration={duration}
					data={data}
					shuffle={shuffle}
					repeat={repeat}

					handleNext={() => this.handleNext()}
					handlePrev={() => this.handlePrev()}
					handleRepeat={() => this.handleRepeat()}
					handleShuffle={() => this.handleShuffle()}
					
					playPause={() => {
						this.wave.playPause();
						this.setState({
							playing: this.wave.isPlaying()
						});
					}}

					
				/>
			</div>
		);
	}
}
