import React, { Component } from 'react'
import {FaTrash, FaSave} from 'react-icons/fa';


export default class index extends Component {
    constructor() {
        super();
        this.ref = React.createRef();
    }
  render() {
    return (
        
                    <div>
                        <div className="btnContainer">
                            <div className="btnLeft">
                                <div className="btnsave" onClick={() => this.props.saveasplaylist(this.ref.current.value)}>
                                    <FaSave />
                                    <div className="btnText">Save as playlist</div>
                                </div>
                            </div>
                            <div className="btnRight">
						        <div className="btnClear" onClick={() => this.props.clearPlaylist()}>
							        <FaTrash />
							        <div className="btnText">Clear list</div>
						        </div>
					        </div>
                        </div>

                        <div className="allinput">
                            <div className="beforinput"></div>
                               <div className="input">
                                  <div><input type="text" className="placeholder" placeholder="Add playlist name here" ref={this.ref}/></div>
                                </div>
                            <div className="afterinput"></div>
                        </div>
                    </div>
    )
  }
}
