import React, { Component } from 'react';
import { Rating } from 'semantic-ui-react';
import dimmer from 'semantic-ui/dist/components/dimmer';
import Modal_book from './modal_book';
import './movie_cards_list.css';

export default class Movie_cards_list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies_data: [],
            active: false, 
            chosen: null 
        }
        this.choose = this.choose.bind(this);
        console.log(this.props.location.pathname);
    }

    componentDidMount() {
        return (
            fetch(this.props.location.pathname == '/Current' ? 'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2017-07&primary_release_date.lte=2017-08&api_key=dd816c83ab8a2311c9d766d517e4f00c' : 'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2017-08&primary_release_date.lte=2017-09&api_key=dd816c83ab8a2311c9d766d517e4f00c')
            .then((res) => res.json())
            .then((json) => {
                this.setState({movies_data: json.results});
            })
            .then(() => {
                $('.movie .ui.dimmer')
                      .dimmer({
                        on: 'hover',
                        opacity: '0.2',
                        dimmerName: 'poster'
                });
            })
            .catch((err) => console.error(err)) 
        );
    }
    
    choose(id) {
        let chosen = this.state.movies_data.find( (i) => i.id == Number(id) );
        this.refs.modal.choose(chosen);
    }

    cardsList() {
        let list = [];
        this.state.movies_data !== null && this.state.movies_data
            .sort((a,b) => b.popularity - a.popularity)
            .map((el, index) => {
                list.push (
                    <div onClick={() => this.choose(el.id)} className="ui card movie" key={index}>
                        <div className="image blurring" style={{height:"380px", overflow:"hidden"}}>
                            <img 
                                src={ el.poster_path ? 
                                        `https://image.tmdb.org/t/p/original/${el.poster_path}` 
                                        : '../img/poster-placeholder.jpg' 
                                } 
                            />
                            <div className="ui dimmer">
                                <div className="content">
                                    <div className="center">
                                        <h3 className="ui inverted header">{el.overview}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content"> 
                            <p className="header" style={{minHeight:"45px"}}>{el.title}</p>
                        </div>
                        <div className="extra content ">
                            <div className="meta left floated">
                              { el.release_date }
                            </div>
                            <Rating icon='star' defaultRating={Math.round(el.vote_average)} maxRating={10} size='mini' disabled />
                        </div>
                    </div>
                );
            });
        return list
    }


    render() {
        return (
            <div className="ui four doubling cards centered">
                <Modal_book ref="modal" location={this.props.location.pathname}/>
                {this.cardsList()}
            </div>
        );
    }
}
