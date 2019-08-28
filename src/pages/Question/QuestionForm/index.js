import React from 'react';
import './styles.css';

// Answer signature
// answer: { text: String, correct: Boolean }

class QuestionForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      availableSubjects: [],
      correctAnswerInputs: 1,
      incorrectAnswerInputs: 1,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderSelectSubjectComponent = this.renderSelectSubjectComponent.bind(this)
    this.renderCorrectAnswerInputs = this.renderCorrectAnswerInputs.bind(this)
    this.renderIncorrectAnswerInputs = this.renderIncorrectAnswerInputs.bind(this)
    this.addAnswer = this.addAnswer.bind(this)
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/subject')
      .then((response) => {
        if (!response.ok)
          throw new Error(`Error fetching subjects: ${response.status} ${response.statusText}`)

        return response.json()
      })
      .then((subjects) => {
        this.setState({ availableSubjects: [...subjects]})
      })
  }

  count = function*(n) {
    for (let i = 1; i <= n; i++)
      yield i;
  }

  addAnswer(correct) {
    console.log('adding answer')
    if (correct)
      this.setState((state) => ({ correctAnswerInputs: state.correctAnswerInputs + 1}))
    else
      this.setState((state) => ({ incorrectAnswerInputs: state.incorrectAnswerInputs + 1}))
  }

  handleSubmit(e) {
    e.preventDefault()
    const form = e.target

    const formData = new FormData(form)

    const req = new XMLHttpRequest()
    req.open('POST', 'http://localhost:3001/api/question')
    req.onload = (event) => {
      if (req.status === 200)
        alert('sent')
      console.log(event)
    }
    req.send(formData)
  }

  renderSelectSubjectComponent() {
    return (
      <select name="subject">
        {this.state.availableSubjects.map((subject, i) => {
          return <option key={i}>{subject}</option>
        })}
      </select>
    )
  }

  renderCorrectAnswerInputs() {
    const children = [...this.count(this.state.correctAnswerInputs)].map((i) => {
      console.log(`Correct: ${i}`)
      if (i === this.state.correctAnswerInputs)
        return <input key={i} type="text" name="correct[]" onChange={(e) => { this.addAnswer(true)}} />
      return <input key={i} type="text" name="correct[]" />
    })

    return (
      <div>
        {children}
      </div>
    )
  }

  renderIncorrectAnswerInputs() {
    const children = [...this.count(this.state.incorrectAnswerInputs)].map((i) => {
      console.log(`Incorrect: ${i}`)
      if (i === this.state.incorrectAnswerInputs)
        return <input key={i} type="text" name="incorrect[]" onChange={(e) => { this.addAnswer(false)}} />
      return <input key={i} type="text" name="incorrect[]" />
    })

    return (
      <div>
        {children}
      </div>
    )
  }

  render () {
    return (
      <form 
        method="POST" 
        encType="multipart/form-data" 
        onSubmit={this.handleSubmit} 
        className="QuestionForm"
      >
        <div>
          <label>Text</label>
          <textarea 
            name="text" 
            maxLength="150" 
          />
        </div>
        <div>
          <label>Subject</label>
          {this.renderSelectSubjectComponent()}
        </div>
        <div>
          <label>Points</label>
          <input
            name="points"
            type="number"
          />
        </div>
        <div>
          <label>Media (if any)</label>
          <input
            name="media"
            type="file"
            multiple
          />
        </div>
        <div className="answers">
          <div className="correct">
            <p>Correct answers</p>
            {this.renderCorrectAnswerInputs()}
          </div>
          <div className="incorrect">
            <p>Incorrect answers</p>
            {this.renderIncorrectAnswerInputs()}
          </div>
        </div>
        <div>
          <input
            type="submit"
            value="Save question"
          />
        </div>
      </form>
    );
  }
}

export default QuestionForm;
