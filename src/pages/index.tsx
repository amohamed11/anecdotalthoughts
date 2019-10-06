import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faCoffee, faEnvelope, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { graphql, Link, withPrefix } from 'gatsby';
import * as React from 'react';
import * as styles from './styles/Index.module.scss';

interface IndexPageProps {
  data: {
    dataJson: {
      basics: {
        name: string;
        label: string;
        title: string;
        summary: string;
        email: string;
        profiles: [{
          network: string;
          url: string;
        }]
      },
    },
  };
}

export const indexPageQuery = graphql`
  query IndexPageQuery {
    dataJson {
      basics {
        name
        label
        title
        summary
        email
        profiles{
          network
          url
        }
      }
    }
  }
`;

export default class IndexPage extends React.Component<IndexPageProps, {}> {

  public render() {
    const {
      name,
      label,
      title,
      summary,
      email,
      profiles,
    } = this.props.data.dataJson.basics;

    return (
      <div className={styles.Container}>
        <h1>{name} <FontAwesomeIcon icon={faCoffee}/> </h1>
        <h3>{label} | {title}</h3>
        <h4>{summary}</h4>

        <div className="footer">
          <a href={email}>
            <FontAwesomeIcon icon={faEnvelope} title="Email me about stuff" size="2x"/>
          </a>
          <a href={profiles[0].url}>
            <FontAwesomeIcon icon={faGithub} title="Check out the things I do" size="2x"/>
          </a>
          <a href={profiles[1].url}>
            <FontAwesomeIcon icon={faLinkedinIn} title="Stalk me on professional facebook" size="2x"/>
          </a>
          <a href="/Resume.pdf" >
            <FontAwesomeIcon icon={faFileAlt} title="Check out this cool resume" size="2x"/>
          </a>
        </div>
      </div>
    );
  }
}
