import React, {PureComponent} from 'react';
import {API, Auth} from "aws-amplify/lib/index";
import Modal from 'react-modal';
import _ from 'lodash';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

export default class Results extends PureComponent {
    state = { isModalOpen: false};

    async componentDidMount() {
        try {
            const [results, credentials] = await Promise.all([
                API.get('premiergeek-api-dev-fixtures', 'results'),
                Auth.currentUserCredentials()]);
            this.setState({results, userIdentity: credentials.data.IdentityId});
        } catch (e) {
            console.log(e);
        }

        this.setState({isLoading: false});
    }

    openUserResults = (userResults) => {
     this.setState({isModalOpen: true, userResults});
    }

    analyzeResults = (results) => {
        let finalResults = results;
        const loggedInUser = _.find(finalResults, {identifier: this.state.userIdentity});
        if(loggedInUser && loggedInUser.paid) {
           finalResults = _.filter(results, {paid: true})
        }
        const sortedResults = _.orderBy(finalResults, 'score', ['desc']);
        return sortedResults.map((result, index) => {
            return (
                <div className="flex justify-between hover-bg-light-blue mv2 items-center pointer"
                     onClick={() => this.openUserResults(result)} key={result.userId}>
                    <div className="flex items-center">
                        <div className="mh3 b w2">{index + 1}</div>
                        <img className="" src={result.logo} />
                        <div className="mh3">
                            {result.name}
                        </div>
                    </div>
                    <div className="mh3">
                        {result.score}
                    </div>
                </div>
            )
        })
    };

    closeModal = () => {
        this.setState({isModalOpen: false});
        console.log(this.state);
    };

    userDetials = () => {
        if (!this.state.isModalOpen) {
            return null;
        }

        const {logo, name, score} = this.state.userResults;
        return (
            <div className="f2 flex mv4 items-center justify-center">
                <img src={logo} className="mr4"/>
                <div className="mh3">{name} </div>
                <div> - {score}</div>
            </div>
        )
    };

    userResults = () => {
        if(!this.state.isModalOpen) {
            return null;
        }
        const userResults = this.state.userResults.results;
        return userResults.map(result => {
            return (
                <div key={result.fixtureId} className="flex f2 items-center justify-between">
                    <div className="flex items-center ">
                        <img src={result.homeTeam.logo}/>
                        <div className="mh3">
                            {`${result.homeTeamScore} (${result.betHomeScore}) - (${result.betAwayScore}) ${result.awayTeamScore}`}
                        </div>
                        <img src={result.awayTeam.logo}/>
                    </div>
                    <div>
                        {result.score}
                    </div>
                </div>
            )
        });
        return(<div> xxxx</div>)
    }
cd
    render() {
        const {results, isModalOpen, userResults} = this.state;
        return (
            <div className="w-50 center flex flex-column f3">
                <div className="self-end">
                    Score
                </div>
                    {this.analyzeResults(results)}
                 <Modal style={ customStyles } isOpen={isModalOpen} onRequestClose={this.closeModal}>
                     {this.userDetials()}
                     {this.userResults()}
                 </Modal>
            </div>
        );
    }
}
