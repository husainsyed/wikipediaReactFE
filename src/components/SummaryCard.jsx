import { Card } from 'primereact/card';
import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ sections }) => {
    return (
        <div>
            {sections.map((sec, idx) => (
                <Card className='card-body' key={idx}>
                    <p key={idx}>
                        <span className='header-style'>{sec.title}: </span>
                        <span>{sec.summary}</span>
                    </p>
                </Card>
            ))}
        </div>
    );
};

export default SummaryCard;
