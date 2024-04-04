/**
 * UserTag.js: Component that holds the updating tag form and queries all tags that share the same user and video id.
 * Can also perform a CSV download of the queried tags
 *
 * Luis Ferrer
 *
 *
 *
 * Date Created: 11/16/2020
 * Last Updated: 11/26/2020
 */

import React, { Component } from "react";
import { CSVLink } from "react-csv";
import Modal from "react-modal";
// import SendTaggedVideo from '../VideoComponents/sendTaggedVideo'
import "../User/css/TagForm.css";

// Constants that the drop down options will use
const thoughtItems = [
  { label: "Thought", value: "TH" },
  { label: "Feeling", value: "FE" },
];

const toneItems = [
  { label: "Positive", value: "POS" },
  { label: "Neutral", value: "NEU" },
  { label: "Negative", value: "NEG" },
];

const contextItems = [
  { label: "Self", value: "SLF" },
  { label: "Dialogue Partner", value: "DPT" },
  { label: "Other Person or Persons", value: "OPP" },
  { label: "Current Context", value: "CTX" },
  { label: "Other Event or Circumstance", value: "OEC" },
];

export default class QueryTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Property used for storing tag data
      data: [],

      loading: false,

      // Handle Individual tag states
      selectedTag: {
        thought_choice: thoughtItems[0].value,
        tone: toneItems[0].value,
        context: contextItems[0].value,
        comment: null,
      },

      // Determine whether to show the tags or not
      display: false,

      // Determine whether to show the legend
      legend: false,

      // Determine whether to show the modal window
      editForm: false,

      fetchedUid: this.props.uuid,

      fetchedVideo: this.props.vid,

      selectedTagId: "Choose",
    };
    this.toggleReveal = this.toggleReveal.bind(this);
    this.toggleLegend = this.toggleLegend.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  // Create an instance of CSV Link
  csvLink = React.createRef();

  /**
   *  Handle all surface level state changes.
   *  Does not affect the nested "selectedTag" object.
   */
  change = (event) => {
    this.setState({
      fetchedUid: this.props.uuid,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * The handlechange function that will handle
   * changes in the nested "selectedTag" object
   */
  handleTag = (e) => {
    const { selectedTag } = { ...this.state };
    const currentState = selectedTag;
    const { name, value } = e.target;
    currentState[name] = value;
    this.setState({ selectedTag: currentState });
  };

  /**
   * Toggle handle to display tag list
   */
  toggleReveal() {
    this.setState((prevState) => ({
      display: !prevState.display,
    }));
  }

  /**
   * Toggle handle to display legend
   */
  toggleLegend() {
    this.setState((prevState) => ({
      legend: !prevState.legend,
    }));
  }

  /**
   * Toggle handle the modal for tag
   * editing
   */
  toggleForm() {
    this.setState((prevState) => ({
      editForm: !prevState.editForm,
    }));
  }

  /**
   *  Function that will fetch all tags that share the same user and video ID
   */
  componentDidMount() {
    this.setState({ loading: true });
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/Home/api/vid_tags/${this.state.fetchedVideo}/uid/${this.state.fetchedUid}/`
    )
      .then((data) => data.json())
      .then((data) => this.setState({ data, loading: false }));
  }

  /**
   * Update the selected tag using the "selectedTagId" property
   * and the PUT request
   */
  updateTag = (event) => {
    event.preventDefault();

    // Fetch the currently selected tag
    fetch(
      `${process.env.REACT_APP_API_URL}/IYS/Home/api/tag/${this.state.selectedTagId}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state.selectedTag),
      }
    )
      .then(alert("Successful Update"))
      .catch((error) => console.error(error));

    window.location.href = `/userhub/watch/${this.state.fetchedVideo}`;
  };

  /**
   * A conditional function that return true if there
   * are any objects in the data property
   *
   * Luis Ferrer
   */
  anyTags() {
    let items = 0;
    let present = false;

    if (this.state.data.length > items) {
      present = true;
    }

    return present;
  }

  render() {
    return (
      <div id="tagcontainer">
        {this.anyTags() ? (
          <div id="tag_update_block">
            {this.state.loading ? (
              "loading..."
            ) : (
              <React.Fragment>
                <CSVLink
                  data={this.state.data}
                  filename="Tag_data.csv"
                  ref={this.csvLink}
                  target="_blank"
                >
                  <p className="csv_link">Download as CSV</p>
                </CSVLink>
                <div>
                  <h3>List of Tags</h3>

                  {this.state.display ? (
                    <div id="tag_list">
                      <button onClick={this.toggleReveal} className="tag_btn">
                        Hide Tags
                      </button>

                      {this.state.legend ? (
                        <React.Fragment>
                          <button onClick={this.toggleLegend}>
                            Hide Legend
                          </button>

                          <p>Thought: TH</p>
                          <p>Feeling: FE</p>
                          <p>Positive: POS</p>
                          <p>Neutral: NEU</p>
                          <p>Negative: NEG</p>
                          <p>Self: SLF</p>
                          <p>Dialogue Partner: DPT</p>
                          <p>Other Person or Persons: OPP</p>
                          <p>Current Context: CTX</p>
                          <p>Other Event or Circumstances: OEC</p>
                        </React.Fragment>
                      ) : (
                        <button onClick={this.toggleLegend}>
                          Reveal Legend
                        </button>
                      )}

                      <table id="tag_tbl">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Thought/ Feeling</th>
                            <th>Tone</th>
                            <th>Context</th>
                            <th>Comment</th>
                            <th>Timestamp</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.data.map((items) => (
                          <tr>
                            <td>{items.id}</td>
                            <td>{items.thought_choice}</td>
                            <td>{items.tone}</td>
                            <td>{items.context}</td>
                            <td>{items.comment}</td>
                            <td>{items.timestamp}</td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <button onClick={this.toggleReveal} className="tag_btn">
                      Show Tags
                    </button>
                  )}
                </div>

                {this.state.editForm ? (
                  <Modal isOpen={this.state.editForm} closeTimeoutMS={500}>
                    <h4>Choose a tag to edit and update</h4>
                    <select name="selectedTagId" onChange={this.change}>
                      <option value={null}>Choose</option>
                      {this.state.data.map((items) => (
                        <option key={items.id} value={items.id}>
                          {items.id}
                        </option>
                      ))}
                    </select>

                    <div className="tag_form">
                      {isNaN(this.state.selectedTagId) ? (
                        <p>Choose a tag using the drop down to edit</p>
                      ) : (
                        <form onSubmit={this.updateTag}>
                          <select
                            name="thought_choice"
                            onChange={this.handleTag}
                            value={this.state.selectedTag.thought_choice}
                          >
                            {thoughtItems.map(({ label, value }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <select
                            name="tone"
                            onChange={this.handleTag}
                            value={this.state.selectedTag.tone}
                          >
                            {toneItems.map(({ label, value }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <select
                            name="context"
                            onChange={this.handleTag}
                            value={this.state.selectedTag.context}
                          >
                            {contextItems.map(({ label, value }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>{" "}
                          <br />
                          <label id="commenlbl">Comment</label>
                          <textarea
                            name="comment"
                            required
                            onChange={this.handleTag}
                          >
                            {this.state.selectedTag.comment}
                          </textarea>
                          <input
                            type="hidden"
                            name="selectedTagId"
                            value={this.state.selectedTagId}
                            onChange={this.change}
                          />
                          <button type="submit" className="tag_btn">
                            Update Tag
                          </button>
                        </form>
                      )}
                    </div>
                    <button onClick={this.toggleForm}>Close</button>
                  </Modal>
                ) : (
                  <button onClick={this.toggleForm}>Edit a Tag</button>
                )}
              </React.Fragment>
            )}
          </div>
        ) : (
          "No Tags Found"
        )}
      </div>
    );
  }
}
