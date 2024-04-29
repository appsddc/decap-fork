import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { translate } from 'react-polyglot';
import { NavLink } from 'react-router-dom';
import { Icon, components, colors } from 'decap-cms-ui-default';

import { searchCollections } from '../../actions/collections';
import CollectionSearch from './CollectionSearch';
import NestedCollection from './NestedCollection';

const styles = {
  sidebarNavLinkActive: css`
    color: ${colors.active};
    background-color: ${colors.activeBackground};
    border-left-color: #9b51e0;
  `,
};

const SidebarContainer = styled.aside`
  ${components.card};
  width: 250px;
  padding: 8px 0 12px;
  position: fixed;
  max-height: calc(100vh - 112px);
  display: flex;
  flex-direction: column;
`;

const SidebarHeading = styled.h2`
  font-size: 23px;
  font-weight: 600;
  padding: 0;
  margin: 18px 12px 12px;
  color: ${colors.textLead};
`;

const SidebarNavList = styled.ul`
  margin: 16px 0 0;
  list-style: none;
  overflow: auto;
`;

const SidebarNavLink = styled(NavLink)`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  align-items: center;
  padding: 8px 12px;
  border-left: 2px solid #fff;
  z-index: -1;

  ${Icon} {
    margin-right: 8px;
    flex-shrink: 0;
  }

  ${props => css`
    &:hover,
    &:active,
    &.${props.activeClassName} {
      ${styles.sidebarNavLinkActive};
    }
  `};
`;


// New styled component for external links
const SidebarExternalLink = styled.a`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  align-items: center;
  padding: 8px 12px;
  border-left: 2px solid #fff;
  z-index: -1;

  ${Icon} {
    margin-right: 8px;
    flex-shrink: 0;
  }

  // Adapt the &:hover, &:active, etc. styles as needed
  &:hover,
  &:active {
    // Replicate the styles for the active state here
  }
`;

export class Sidebar extends React.Component {
  static propTypes = {
    collections: ImmutablePropTypes.map.isRequired,
    collection: ImmutablePropTypes.map,
    isSearchEnabled: PropTypes.bool,
    searchTerm: PropTypes.string,
    filterTerm: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  renderLink = (collection, filterTerm) => {
    const collectionName = collection.get('name');
    let iconType;

  // Determine the icon type based on the collection name
  switch (collectionName) {
    case 'config':
      iconType = 'settings';
      break;
    case 'portfolio':
      iconType = 'portfolio';
      break;
    case 'advanced':
      iconType = 'showroom';
      break;
    default:
      iconType = 'page'; // replace 'defaultIcon' with your default icon type
      break;
    }


    if (collection.has('nested')) {
      return (
        <li key={collectionName}>
          <NestedCollection
            collection={collection}
            filterTerm={filterTerm}
            data-testid={collectionName}
          />
        </li>
      );
    }
    return (
      <li key={collectionName}>
        <SidebarNavLink
          to={`/collections/${collectionName}`}
          activeClassName="sidebar-active"
          data-testid={collectionName}
        >
          
          <Icon type={iconType} />
          {collection.get('label')}
        </SidebarNavLink>
      </li>
    );
  };

  render() {
    const { collections, collection, isSearchEnabled, searchTerm, t, filterTerm } = this.props;
    return (
      <SidebarContainer>
        <SidebarHeading>
        Dashboard
        </SidebarHeading>
        {isSearchEnabled && (
          <CollectionSearch
            searchTerm={searchTerm}
            collections={collections}
            collection={collection}
            onSubmit={(query, collection) => searchCollections(query, collection)}
          />
        )}
        <SidebarNavList>
          {collections
            .toList()
            .filter(collection => collection.get('hide') !== true)
            .map(collection => this.renderLink(collection, filterTerm))}


        </SidebarNavList>

        <li key={'docs'} style={{ listStyle: 'none' }}>
          <SidebarExternalLink 
            href='https://docs.kleaver.ie'
            target='_blank'
            rel='noopener noreferrer'
            data-testid={'docs'}
          >
            <Icon type={'page'} />
            Documentation
          </SidebarExternalLink>
        </li>
      </SidebarContainer>
    );
  }
}

export default translate()(Sidebar);
