/* global Routes window */

// Modules
import React, { Component } from 'react';
import Relay from 'react-relay';
import Formsy from 'formsy-react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Snackbar from 'material-ui/Snackbar';
import {
  Card,
  CardTitle,
  CardText,
} from 'material-ui/Card';
import { FormsyCheckbox, FormsyText } from 'formsy-material-ui/lib';
import { css } from 'aphrodite';

// Child Components
import muiTheme from '../theme.es6';

// Mutations
import UpdateDeveloper from '../../mutations/developer/updateDeveloper.es6';

// Stylesheets
import formStyles from '../styles/forms.es6';

const cardTitleStyle = {
  padding: '8px 16px 8px',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #d8d8d8',
};

class DeveloperEdit extends Component {
  static onKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.clearValidationErrors = this.clearValidationErrors.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    this.setNotification = this.setNotification.bind(this);

    this.state = {
      open: false,
      value: 1,
      loaded: false,
      canSubmit: false,
      notification: '',
      validationErrors: {},
    };
  }

  setNotification(notification) {
    this.setState({
      notification,
    }, () => {
      this.setState({ open: true });
    });
  }

  submitForm(event) {
    event.preventDefault();
    this.setNotification('Saving...');

    const onFailure = (transaction) => {
      const error = transaction.getError() || new Error('Mutation failed.');
      let errorMessage;

      if (error.source.errors && Array.isArray(error.source.errors)) {
        errorMessage = error.source.errors[0].message;
      } else {
        errorMessage = error.message;
      }

      this.setNotification(errorMessage);
    };

    const onSuccess = () => {
      window.location.href = Routes.developer_path(this.props.developer.login);
    };

    Relay.Store.commitUpdate(new UpdateDeveloper({
      id: this.props.developer.id,
      ...this.formNode.getModel(),
    }), { onFailure, onSuccess });
  }

  enableButton() {
    this.setState({
      canSubmit: true,
    });
  }

  disableButton() {
    this.setState({
      canSubmit: false,
    });
  }

  clearValidationErrors() {
    this.setState({
      validationErrors: {},
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    const { developer } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Card
          className="card"
          style={{ border: '1px solid #d8d8d8' }}
        >
          <CardTitle
            title="Update your profile"
            style={cardTitleStyle}
            titleStyle={{
              color: '#333',
              fontSize: 18,
              fontWeight: 500,
            }}
          />

          <CardText style={{ padding: '16px 16px 0', fontSize: 16 }}>
            <div className="profile-edit">
              <Formsy.Form
                onValid={this.enableButton}
                autoComplete="off"
                className="form"
                ref={node => (this.formNode = node)}
                onInvalid={this.disableButton}
                validationErrors={this.state.validationErrors}
              >
                <div className="field bio">
                  <FormsyText
                    id="text-field-default"
                    placeholder="(ex: Looking for opportunities in AI)"
                    autoFocus
                    name="bio"
                    fullWidth
                    multiLine
                    defaultValue={developer.bio}
                    floatingLabelText="What are you looking for *"
                    floatingLabelFixed
                    updateImmediately
                    required
                    validations={{
                      minLength: 50,
                      maxLength: 140,
                    }}
                    validationErrors={{
                      minLength: 'Bio should be minimum 50 characters',
                      maxLength: 'Bio should be minimum 140 characters',
                    }}
                  />
                </div>

                <div className="field">
                  <FormsyText
                    id="text-field-default"
                    placeholder="(ex: London, Toronto, Oslo)"
                    name="location"
                    fullWidth
                    onKeyDown={DeveloperEdit.onKeyPress}
                    defaultValue={developer.location}
                    floatingLabelText="Where are you based *"
                    floatingLabelFixed
                    required
                    className={css(formStyles.half)}
                  />

                  <FormsyText
                    id="text-field-default"
                    placeholder="(ex: https://blog.com)"
                    name="blog"
                    className={css(formStyles.half)}
                    fullWidth
                    onKeyDown={DeveloperEdit.onKeyPress}
                    defaultValue={developer.blog}
                    floatingLabelText="Blog or Website"
                    floatingLabelFixed
                    updateImmediately
                    validations={{
                      isUrl: true,
                    }}
                    validationErrors={{
                      isUrl: 'Should be a valid url',
                    }}
                  />
                </div>

                <div className="clearfix" />

                <div className="header-separator">Availability</div>
                <div className="hireable">
                  <FormsyCheckbox
                    label="Hireable *"
                    className={css(formStyles.inline)}
                    name="hireable"
                    defaultChecked={developer.hireable}
                  />
                  <div className="clearfix" />
                  <span className={css(formStyles.help)}>
                    * Employers will be able to contact you
                  </span>
                </div>

                <div className="clearfix" />
                <div className="header-separator">Preferences</div>
                <div className="field">
                  <div className={css(formStyles.preferences)}>
                    <FormsyCheckbox
                      label="Relocate"
                      className={css(formStyles.inline)}
                      name="relocate"
                      defaultChecked={developer.relocate}
                    />

                    <FormsyCheckbox
                      label="Remote"
                      className={css(formStyles.inline)}
                      name="remote"
                      defaultChecked={developer.remote}
                    />
                  </div>

                  <div className="clearfix" />
                  <div className="field job">
                    <div className="header-separator">Job Type</div>
                    <FormsyCheckbox
                      label="Part-Time"
                      className={css(formStyles.inline)}
                      name="part_time"
                      defaultChecked={developer.part_time}
                    />

                    <FormsyCheckbox
                      label="Full-Time"
                      className={css(formStyles.inline)}
                      name="full_time"
                      defaultChecked={developer.full_time}
                    />

                    <FormsyCheckbox
                      label="Contract"
                      className={css(formStyles.inline)}
                      name="contract"
                      defaultChecked={developer.contract}
                    />

                    <FormsyCheckbox
                      label="Freelance"
                      className={css(formStyles.inline)}
                      name="freelance"
                      defaultChecked={developer.freelance}
                    />

                    <FormsyCheckbox
                      label="Internship"
                      className={css(formStyles.inline)}
                      name="internship"
                      defaultChecked={developer.internship}
                    />

                    <FormsyCheckbox
                      label="Startup"
                      className={css(formStyles.inline)}
                      name="startup"
                      defaultChecked={developer.startup}
                    />
                  </div>

                  <div className="clearfix" />
                  <div className="field levels">
                    <div className="header-separator">Experience Level</div>
                    <FormsyCheckbox
                      label="CTO"
                      className={css(formStyles.inline)}
                      name="cto"
                      defaultChecked={developer.cto}
                    />

                    <FormsyCheckbox
                      label="Lead"
                      className={css(formStyles.inline)}
                      name="lead"
                      defaultChecked={developer.lead}
                    />

                    <FormsyCheckbox
                      label="Senior"
                      className={css(formStyles.inline)}
                      name="senior"
                      defaultChecked={developer.senior}
                    />

                    <FormsyCheckbox
                      label="Mid-level"
                      className={css(formStyles.inline)}
                      name="mid"
                      defaultChecked={developer.mid}
                    />

                    <FormsyCheckbox
                      label="Junior"
                      className={css(formStyles.inline)}
                      name="junior"
                      defaultChecked={developer.junior}
                    />

                    <FormsyCheckbox
                      label="Student"
                      className={css(formStyles.inline)}
                      name="student"
                      defaultChecked={developer.student}
                    />
                  </div>
                </div>

                <div className="clearfix" />
                <div className="actions">
                  <RaisedButton
                    label="Update"
                    primary
                    className={css(formStyles.input)}
                    type="submit"
                    onClick={this.submitForm}
                    disabled={!this.state.canSubmit}
                  />

                  <RaisedButton
                    label="Back"
                    primary
                    type="submit"
                    style={{ marginLeft: 10 }}
                    href={Routes.root_path()}
                  />

                  <RaisedButton
                    secondary
                    label="Delete account"
                    icon={<ActionDelete />}
                    data-method="delete"
                    data-confirm="This will delete your account. Okay?"
                    className="delete-link pull-right"
                    href={Routes.cancel_developer_registration_path()}
                  />
                </div>

                <div className="notifications">
                  <Snackbar
                    open={this.state.open}
                    ref={node => (this.notification = node)}
                    message={this.state.notification}
                    autoHideDuration={5000}
                    onRequestClose={this.handleRequestClose}
                  />
                </div>
              </Formsy.Form>
            </div>
          </CardText>
        </Card>
      </MuiThemeProvider>
    );
  }
}

DeveloperEdit.propTypes = {
  developer: React.PropTypes.object,
};

const DeveloperEditContainer = Relay.createContainer(DeveloperEdit, {
  fragments: {
    developer: () => Relay.QL`
      fragment on Developer {
        id,
        name,
        login,
        bio,
        blog,
        location,

        hireable,

        remote,
        relocate,

        part_time,
        full_time,
        contract,
        freelance,
        internship,
        startup,

        cto,
        lead,
        senior,
        mid,
        junior,
        student,
      }
    `,
  },
});

export default DeveloperEditContainer;
