import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BuilderPage.css';
import { CarBuilderForm } from '../car/CarBuilderForm';

const STEPS = [
  { n: 1, label: 'Select Car' },
  { n: 2, label: 'Customise' },
  { n: 3, label: 'Preview' },
  { n: 4, label: 'Order' },
];

export function BuilderPage() {
  const [activeStep] = useState(1);
  const [builderValue, setBuilderValue] = useState<Record<string, unknown>>({});

  return (
    <div className="builder-page">
      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <Link to="/">Home</Link> / <span>Custom Builder</span>
      </div>

      {/* Header */}
      <section className="builder-header">
        <div className="builder-header__text">
          <span className="builder-header__tag">🎨 Custom Builder</span>
          <h1 className="builder-header__title">Build Your Perfect Cover</h1>
          <p className="builder-header__sub">
            Select your vehicle, choose your materials and preview your custom cover
            before placing an order — all in a few simple steps.
          </p>
        </div>

        {/* Step indicator */}
        <div className="builder-steps">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.n}>
              <div className={`builder-step${activeStep >= step.n ? ' builder-step--done' : ''}${activeStep === step.n ? ' builder-step--active' : ''}`}>
                <div className="builder-step__num">{activeStep > step.n ? '✓' : step.n}</div>
                <span className="builder-step__label">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`builder-step__line${activeStep > step.n ? ' builder-step__line--done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Builder form */}
      <section className="builder-body">
        <div className="builder-form-wrap">
          <CarBuilderForm onChange={(value) => setBuilderValue(value as Record<string, unknown>)} />
        </div>

        {/* Sidebar */}
        <aside className="builder-aside">
          <div className="builder-aside__card">
            <h3 className="builder-aside__title">Your Selection</h3>
            {Object.keys(builderValue).length === 0 ? (
              <p className="builder-aside__empty">Complete the form to see your summary.</p>
            ) : (
              <ul className="builder-aside__list">
                {Object.entries(builderValue).map(([k, v]) => (
                  <li key={k} className="builder-aside__item">
                    <span className="builder-aside__key">{k}</span>
                    <span className="builder-aside__val">{String(v)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="builder-aside__card builder-aside__card--yellow">
            <h4 className="builder-aside__faq-title">How it works</h4>
            <ol className="builder-aside__faq">
              <li>Select your car make & model</li>
              <li>Choose your cover material</li>
              <li>Add your logo or custom design</li>
              <li>Preview the result</li>
              <li>Place your order</li>
            </ol>
            <Link to="/contact" className="builder-aside__help-link">Need help? Contact us →</Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
