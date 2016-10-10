/* global document window $ */

import React, { Component } from 'react';
import Relay from 'react-relay';
import _ from 'underscore';
import queryString from 'query-string';
import Loader from 'react-loader';
import { List } from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import Developer from './developer.es6';
import PremiumDeveloper from './premium_developer.es6';
import Search from './search.es6';
import NoContent from './no_content.es6';
import EmptyList from './empty_list.es6';

class DevelopersList extends Component {
  constructor(props) {
    super(props);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      open: false,
      loaded: false,
    };
  }

  componentDidMount() {
    const queryObject = _.omit(queryString.parse(document.location.search), 'page');
    this.props.relay.setVariables(queryObject, (readyState) => {
      if (readyState.done) {
        this.setState({ loaded: true });
      }
    });
  }

  loadMore(event) {
    event.preventDefault();
    this.props.relay.setVariables({
      first: this.props.relay.variables.first + 20,
      page: (parseInt(this.props.relay.variables.page, 0) + 1).toString(),
    });
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    const containerStyle = {
      paddingTop: '0px',
      borderRight: '1px solid #f2f2f2',
      boxShadow: '0 0 16px 0 rgba(63,67,69,0.3)',
      margin: '40px 0px',
    };

    const { root, relay } = this.props;

    return (
      <MuiThemeProvider>
        <div className="developers-list wrapper">
          <div className="container">
            <div className="developers-list developers--small sm-pull-reset col-md-5">
              <Search action={'/developers'} relay={relay} />
            </div>
            <Loader loaded={this.state.loaded}>
              {root.developers.edges && root.developers.edges.length > 0 ?
                <List className="col-md-7 pull-right" style={containerStyle}>
                  {root.developers.edges.map(({ node }) => (
                    node.remote ?
                      <PremiumDeveloper
                        developer={node}
                        key={node.id}
                      /> :
                      <Developer
                        developer={node}
                        key={node.id}
                      />
                  ))}
                  {root.developers.pageInfo != null && root.developers.pageInfo.hasNextPage  ?
                    <a onClick={this.loadMore} href="#">
                      Load More
                    </a>
                    : <NoContent />
                  }
                </List> : <EmptyList />}
              </Loader>
            <Snackbar
              open={this.state.open}
              ref="snackbar_404"
              message="Ohh no! Request failed! Make sure you are using right parameters"
              action="error"
              onRequestClose={this.handleRequestClose}
              autoHideDuration={5000}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

DevelopersList.propTypes = {
  root: React.PropTypes.object,
  relay: React.PropTypes.object,
};

const DevelopersListContainer = Relay.createContainer(DevelopersList, {
  initialVariables: {
    first: 20,
    fullname: null,
    location: null,
    language: null,
    followers: '>10',
    repos: '>10',
    order: '-id',
    page: '1',
  },

  fragments: {
    root: () => Relay.QL`
      fragment on Viewer {
        id,
        developers(
          first: $first,
          fullname: $fullname,
          location: $location,
          language: $language,
          followers: $followers,
          repos: $repos,
          order: $order,
          page: $page,
        ) {
          edges {
            node {
              id,
              ${Developer.getFragment('developer')}
            }
          }

          pageInfo {
            hasNextPage
          }
        }
      }
    `,
  },
});

export default DevelopersListContainer;
