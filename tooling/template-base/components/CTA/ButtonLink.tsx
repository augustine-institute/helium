import React from 'react';
import share from '../Assets/share';

const element = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 3H3C2.46957 3 1.96086 3.21071 1.58579 3.58579C1.21071 3.96086 1 4.46957 1 5V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H13C13.5304 17 14.0391 16.7893 14.4142 16.4142C14.7893 16.0391 15 15.5304 15 15V11M11 1H17M17 1V7M17 1L7 11"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ButtonLink = (props: { text: string; linkUrl: string }) => {
  return (
    <div className="m-8 flex justify-center">
      <a href={props.linkUrl} className="">
        <button className="flex flex-row justify-center shadow-md rounded-full bg-slate-100 text-black font-semibold text-lg w-80 h-11 py-2 text-center">
          {props.text}
          <div className="pl-2 pt-1">{share}</div>
        </button>
      </a>
    </div>
  );
};

export default ButtonLink;
