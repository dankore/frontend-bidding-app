import React, { useEffect, useState } from 'react';
import Page from '../components/Page';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';

function ViewSingleBid() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [bid, setBid] = useState();

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchBid() {
      try {
        const response = await Axios.get(`/bid/${id}`, {
          cancelToken: request.token,
        });
        setBid(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log('Problem with fetching bids.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    // TODO SAME ANYWHERE AXIOS GETS CALLED
    return () => {
      request.cancel();
    };
  }, [id]);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  const date = new Date(bid.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title={bid.title}>
      <div className='flex justify-between'>
        <h2 className='text-2xl'>{bid.title}</h2>
        <span className='pt-2'>
          <a to='#' className='text-blue-600 mr-1' title='Edit'>
            <i className='fas fa-edit'></i>
          </a>
          <a className='text-red-600' title='Delete'>
            <i className='fas fa-trash'></i>
          </a>
        </span>
      </div>

      <p className='flex items-center'>
        <Link to={`/profile/${bid.author.username}`}>
          <img className='w-10 h-10 rounded-full mr-2' src={bid.author.avatar} />
        </Link>
        <Link className='mx-1' to={`/profile/${bid.author.username}`}>
          {bid.author.firstName} {bid.author.lastName}
        </Link>{' '}
        on 2/10/2020
      </p>

      <div className='mt-6'>{bid.description}</div>
    </Page>
  );
}

export default ViewSingleBid;
