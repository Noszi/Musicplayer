import React, { Component } from 'react';
import './index.css';
import Listitem from './Listitem';
import {Folder, Playlist, Saved} from './Page'

export default class index extends Component {
	render() {
		return (
			<div className="playlistContainer">
				{
					this.props.selected == -2 ? 
						<Folder 
							clearList={() => this.props.clearList()} 
							selectnone={() => this.props.selectnone()} 
							selectall={() => this.props.selectall()}
						/> :
					this.props.selected == -1 ? 
						<Playlist 
							saveasplaylist={(name) => this.props.saveasplaylist(name)}
							clearPlaylist={() => this.props.clearPlaylist()}
						/> : 
						<Saved 
							list={this.props.list}
							callpl={(i) => this.props.callpl(i)}
							deletepl={(i) => this.props.deletepl(i)}

						/>
				}
				{this.props.selected != -3 && this.props.list.map((item, key) => {
					return (
						<Listitem
							selected={this.props.selected}
							active={item == this.props.current ? true : false}
							play={() => this.props.play(key)}
							remove={() => this.props.remove(key)}
							like={() => this.props.like(key)}
							liked={this.props.playlist.includes(item)}
							key={item}
							item={item}
						/>
					);
				})}
			</div>
		);
	}
}
