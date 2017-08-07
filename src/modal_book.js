import React, { Component } from 'react';
import modal from 'semantic-ui/dist/components/modal';
import dimmer from 'semantic-ui/dist/components/dimmer';
import transition from 'semantic-ui/dist/components/transition';
import classnames from 'classnames';
import './modal_book.css';

export default class modal_book extends Component {
    constructor(props) {
        super(props);
        this.activate = this.activate.bind(this);
        this.choose_day = this.choose_day.bind(this);
        this.state = {
            times: [
                {
                    day: '7',
                    hours: '01',
                    minutes: '00'
                },
                {
                    day: '7',
                    hours: '11',
                    minutes: '35'
                },
                {
                    day: '7',
                    hours: '18',
                    minutes: '00'
                },
                {
                    day: '7',
                    hours: '19',
                    minutes: '35'
                },
                {
                    day: '7',
                    hours: '23',
                    minutes: '50'
                },
                {
                    day: '8',
                    hours: '12',
                    minutes: '00'
                },
                {
                    day: '8',
                    hours: '13',
                    minutes: '35'
                },
                {
                    day: '8',
                    hours: '15',
                    minutes: '00'
                },
                {
                    day: '8',
                    hours: '17',
                    minutes: '25'
                },
                {
                    day: '8',
                    hours: '19',
                    minutes: '05'
                },
                {
                    day: '8',
                    hours: '22',
                    minutes: '00'
                },
            ],
            active_time: null,
            active_date: new Date().getDate().toString(),
            movie_data: [],
            additional_movie_data: [],
            loading: true
        }
    }

    activate(e) {
        this.setState({ active_time: e });
    }

    choose(chosen) {
        fetch(`https://api.themoviedb.org/3/movie/${chosen.id}?api_key=dd816c83ab8a2311c9d766d517e4f00c`)
          .then((res) => res.json())
          .then((movie_data) => {
              this.setState({additional_movie_data: chosen})
              this.setState({ movie_data });
          })
          .then(() => {
              //bind modal window and show
            $('.ui.modal')
              .modal({
                blurring: true,
                observeChanges: true
              })
              .modal('show');

            //some buf fix
            if($('.ui.modal').length > 1) $('.ui.modal')[0].remove();
            //fix centralization bug after img load
            $('#img').on('load', function() {
                $('.ui.modal').modal('refresh');
            });
          })        
          .catch((err) => console.error(err))
    }

    choose_day(chosen) {
        this.setState({ active_date: chosen });
        this.setState({ active_time: null });
    }

    dates() {
        let now = new Date();
        let today = now.getDate();
        let otherday = today + 5;
        let arr = [];
        for(today; today < otherday; today++) {
            let date = new Date(now.getFullYear(), now.getMonth(), today);
            let wr = `${this.monthNames(date.getMonth().toString())} / ${date.getDate().toString()}`;
            arr.push(
                <div onClick={ () => {this.choose_day(date.getDate().toString())} } 
                     key={wr} 
                     className={classnames("date", { date_active: date.getDate().toString() == this.state.active_date })}
                >
                    <span>{wr}</span>
                </div>
            );
        }
        return arr;
    }
    duration() {
        return (
          `${ this.state.movie_data.runtime > 60 ? 
            ((Math.floor(this.state.movie_data.runtime / 60)).toString()+':'+
                (this.state.movie_data.runtime - Math.floor(this.state.movie_data.runtime / 60) * 60 < 10 ? 
                    '0'+(this.state.movie_data.runtime - Math.floor(this.state.movie_data.runtime / 60) * 60).toString() 
                    : this.state.movie_data.runtime - Math.floor(this.state.movie_data.runtime / 60) * 60).toString())
            : this.state.movie_data.runtime }`
        ) 
        
    }
    monthNames(x) {
        let monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[x];
    }

    render() {
         return (
            <div>
                <div className="ui modal">
                    <i className="close icon"></i>
                    <div className="header">
                        <div className="title">
                            {this.state.additional_movie_data.title}
                        </div>
                        <div className="duration">
                            <i className="wait icon"></i>
                            <span>
                                {this.duration()}
                            </span>
                        </div>
                    </div>
                    <div className="ui fluid image">
                        <img id="img" src={`https://image.tmdb.org/t/p/original/${ this.state.movie_data.backdrop_path }`} />
                    </div>
                    
                    <div className="content">
                        <div className="title_year_countries">
                        <p>
                            {this.state.movie_data.length != 0 && 
                                `${this.state.movie_data.original_title} | ${this.state.movie_data.release_date.substring(0, 4)} | `
                            }
                        </p>
                        {this.state.movie_data.length != 0  ? 
                            this.state.movie_data.production_countries.map((el, index) => {
                                return(
                                    <i key={index} className={`${el.iso_3166_1.toLowerCase()} flag`}></i>
                                )
                            }) 
                            : null 
                        }
                        </div>
                        <div className="genres">
                            <p> 
                                <strong>Genres: </strong> 
                            </p>
                            {this.state.movie_data.length != 0 && this.state.movie_data.genres.map((el, index) => {
                                    return(
                                        <p key={index}>
                                            {el.name}
                                            {Number(index) < this.state.movie_data.genres.length-1 ? 
                                                ', ' : null
                                            }
                                        </p>
                                    )
                                })
                            }
                        </div>
                        <div className="description">
                            <div className="ui divider" />
                            <div className="ui header">
                                <p>
                                    {this.state.additional_movie_data.overview}
                                </p>
                            </div>
                            <div className="ui divider" />
                            <div className="date-choose ui grid">
                                {this.props.location == '/Current' && this.dates()}
                            </div>
                            <div className="ui divider" />
                            <div className="time-choose ui grid">
                                {this.props.location == '/Current' && 
                                    this.state.times
                                    .filter((x) => {
                                        return x.day == this.state.active_date;
                                    })
                                    .map((el, index) => {
                                            let currentTime = new Date();
                                            let planeTime = new Date().setHours(el.hours, el.minutes);
                                            return (
                                                <div onClick={() => this.activate(index)} 
                                                    key={index} 
                                                    className={
                                                       classnames( "time two wide column", {
                                                          time_active: (this.state.active_time == index), 
                                                          time_block: 
                                                            ((this.state.active_date == currentTime.getDate().toString()) && (currentTime > planeTime)) 
                                                       })
                                                    }
                                                >
                                                    <span>
                                                        {`${el.hours}:${el.minutes}`}
                                                    </span>
                                                </div>
                                            )
                                    })
                                }
                            </div>
                        </div>
                        <div className="actions">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
