import React from "react";
import "./Sidebar.css";

export function Sidebar() {
  return (
    <aside className="sidebar">
     <div className="banner">
      <h4>MEGA SALE</h4>
      <button className = "btn btn--primary">SHOP NOW</button>
     </div>
     <div className="brand-cont">
       <h3 className="sidebar__title">Brands</h3>
        <div className="bands">
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
          <img className="brand-img" src = "/" width={20} height={20}/>
        </div>
     </div>
  <div className="category-container">
    <div className="category-content">
      <h3 className="sidebar__title">Categories</h3>
      <ul className="sidebar__list">
        <li className="sidebar__item">
          <a className="sidebar__link" href="#interior">
            Interior Covers <span className="sidebar__count">24</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a className="sidebar__link" href="#exterior">
            Exterior Covers <span className="sidebar__count">16</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a className="sidebar__link" href="#custom-builder">
            Custom Builder Covers <span className="sidebar__count">8</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a className="sidebar__link" href="#accessories">
            Accessories <span className="sidebar__count">32</span>
          </a>
        </li>
      </ul>
      </div>
    </div>
    </aside>
  );
}
