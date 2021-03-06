import React from "react"
import Page from '../../components/shared/Page';
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Page title='Not Found'>
      <div className='text-center'>
        <h2 className='text-3xl'>Page not found.</h2>
        <p className='tracking-wide text-gray-700'>
          You may visit the <Link className='text-blue-500' to='/'>homepage</Link> and try again.
        </p>
      </div>
    </Page>
  );
}

export default NotFoundPage