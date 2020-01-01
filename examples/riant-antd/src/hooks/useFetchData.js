import { useState, useCallback } from 'react';
import fetch from '~/commons/fetch';

export default function (options, initData) {
  const [ loading, setLoading ] = useState(false);
  const [ data, setData ] = useState(initData);
  const doFetch = useCallback((params)=> {
    setLoading(true);
    options.data = params;
    fetch(options).then(res => {
      setData(res.data);
      setLoading(false);
    }, function () {
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ { data, loading }, doFetch ];
}