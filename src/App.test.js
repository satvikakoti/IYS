/**
 * App.test.js: A js with the purpose to test the rendering of application components
 *
 * Luis Ferrer
 * 
 * Note: Not to be used in production and is used as a reference.
 * Missing timestamp capture function. Only delete if truly 
 * necessary
 *
 * Original intent: To modularize the tagging form into one component
 * 
 * Date Created: 12/01/2020
 * Last Updated: 12/02/2020
 */


import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import App from './App';
import QueryTags from './Tag/UserTags'
import Basics, { LoginGuide, UserHubGuide, UserProfGuide} from './TrainingComponents/Sections'
import UserProf from './UserComponents/user'
import SignUp from './UserComponents/signUp'
import Login from './UserComponents/login'
import UserVideos from './VideoComponents/userVideos'
import FileUploadComponent from './VideoComponents/videoUpload'
import WatchVideo from './VideoComponents/watchVideo'

afterEach(cleanup)

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('Show if password placeholder is present', () => {
  const { getByPlaceholderText } = render(<UserProf/>)
  const placeholderPwd = getByPlaceholderText('********')
  expect(placeholderPwd).toBeInTheDocument();
})

test('Show prompt for update tag form if no tag data is present', () => {
  const { getByText } = render(<QueryTags/>);
  const h4Get = getByText('No Tags Found')
  expect(h4Get).toBeInTheDocument()
})

test('Sign Up form renders', () => {
  const { getByPlaceholderText } =  render(<SignUp/>)
  const h1Get = getByPlaceholderText('First Name')
  expect(h1Get).toBeInTheDocument()
})

test('Login form renders', () => {
  const { getAllByText } = render(<Login/>)
  const getForm = getAllByText(/Log in/i)
  expect(getForm).toBeInTheDocument()
})

test('My videos page renders', () => {
  const { getByText } = render(<UserVideos/>)
  const getPage = getByText('My Videos')
  expect(getPage).toBeInTheDocument()
})

test('Video upload page renders', () => {
  const { getByText } = render(<FileUploadComponent/>)
  const getPage = getByText('Upload a video')
  expect(getPage).toBeInTheDocument()
})

test('Login html guide renders', () => {
  const { getAllByText } = render(<LoginGuide/>)
  const getPage = getAllByText(/Log in/i)
  expect(getPage).toBeInTheDocument()
})

test('User hub html guide renders', () => {
  const { getByText } = render(<UserHubGuide/>)
  const getPage = getByText('User Hub')
  expect(getPage).toBeInTheDocument()
})

test('User profile html guide renders', () => {
  const { getByText } = render(<UserProf/>)
  const getPage = getByText('User Profile')
  expect(getPage).toBeInTheDocument()
})

test('Intro to training portal renders', () => {
  const { getByText } = render(<Basics/>)
  const getPage = getByText('Site Basics')
  expect(getPage).toBeInTheDocument()
})

// it('Tag button functions', () => {
//   const { getByText } = render(<WatchVideo/>)

//   expect(getByText('Tag').textContent).tobe('Tag')

//   fireEvent.click(getByText('Tag'))

//   expect(getByText('Confirm Tag').textContent).toBe('Confirm Tag')
// })













