import React, { FC, useState } from 'react';
import { GenericErrorWrapper } from 'agora-meeting-core';
import { transI18n } from '~ui-kit';
import { Stars } from '~components/stars';
import { observer } from 'mobx-react';
import MD5 from 'js-md5';
import './index.css';

async function fetch(params: any) {
  const { method, data, url } = params;
  const opts: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    opts.body = JSON.stringify(data);
  }
  let resp = null;
  try {
    resp = await window.fetch(url, opts);
  } catch (err) {
    throw GenericErrorWrapper(err);
  }
  return resp;
}

interface RatingProps {
  launchOption: any;
  onSubmit?: () => void;
}

export const Rating: FC<RatingProps> = observer(
  ({ launchOption, onSubmit }) => {
    const [form, setForm] = useState({
      call_quality: 5,
      function_completeness: 5,
      general_experience: 5,
      comment: '',
    });

    const handleTextChange = (e: any) => {
      setForm((pre: any) => {
        return { ...pre, comment: e.target.value };
      });
    };

    const submit = async () => {
      try {
        const time = new Date().getTime();
        await fetch({
          url: 'https://evaluation.bj2.agoralab.co/v1/evaluation/report',
          method: 'POST',
          data: {
            evaluation: {
              app: 'Agora Meeting',
              comment: form.comment,
              device: navigator.userAgent,
              os: 'web',
              rating: {
                call_quality: form.call_quality,
                function_completeness: form.function_completeness,
                general_experience: form.general_experience,
              },
              session_id: launchOption?.roomId,
              time: time,
              user_case: 'meeting',
              user_id: launchOption?.userId,
            },
            sign: MD5(`src=Agora Meeting&ts=${time}`),
            src: 'Agora Meeting',
            ts: time,
          },
        });
        onSubmit && onSubmit();
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="rating">
        <div className="rating-item">
          <span className="left">{transI18n('rating.call_quality')}</span>
          <span className="right">
            <Stars
              defaultNum={5}
              onChange={(num) => {
                setForm((pre: any) => {
                  return { ...pre, call_quality: num };
                });
              }}></Stars>
          </span>
        </div>
        <div className="rating-item">
          <span className="left">
            {transI18n('rating.function_completeness')}
          </span>
          <span className="right">
            <Stars
              defaultNum={5}
              onChange={(num) => {
                setForm((pre: any) => {
                  return { ...pre, function_completeness: num };
                });
              }}></Stars>
          </span>
        </div>
        <div className="rating-item">
          <span className="left">{transI18n('rating.general_experience')}</span>
          <span className="right">
            <Stars
              defaultNum={5}
              onChange={(num) => {
                setForm((pre: any) => {
                  return { ...pre, general_experience: num };
                });
              }}></Stars>
          </span>
        </div>
        <div className="rating-item">
          <span className="left">{transI18n('rating.comment')}</span>
          <span className="right">
            <textarea
              value={form.comment}
              onChange={handleTextChange}></textarea>
          </span>
        </div>
        <div className="rating-item">
          <span className="center">
            <span className="btn-submit" onClick={(e) => submit()}>
              {transI18n('submit')}
            </span>
          </span>
        </div>
      </div>
    );
  },
);
