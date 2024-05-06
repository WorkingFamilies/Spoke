[![Build Status](https://travis-ci.org/MoveOnOrg/Spoke.svg?branch=main)](https://travis-ci.org/MoveOnOrg/Spoke)
[![Contributor
Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

# WFP Spoke Instance Deployment Notes

WFP Spoke is deployed on Heroku.

In April 2024 we are spinning down our heroku db because we are not
actively using it.

The database backup can be found at `s3://wfp-misc/wfp-spoke-heroku-backup-20240417.dump`

Instructions on how to restore the db from the backup can be found [here](https://devcenter.heroku.com/articles/heroku-postgres-backups#manual-backups).

Essentially create a publically accessible signed URL for the db and
run `heroku pg:backups:restore '$SIGNED_URL' -a wfp-spoke`

The app also needs these add-ons to run:
- bucketeer:micro
- web (Standard-2X)
- mailgun:concept50k
- papertrail:fixa
- heroku-redis:premium-1


# Spoke

Spoke is an open source text-distribution tool for organizations to mobilize supporters and members into action. Spoke allows you to upload phone numbers, customize scripts and assign volunteers to communicate with supporters while allowing organizations to manage the process.

Spoke was created by Saikat Chakrabarti and Sheena Pakanati, and is now maintained by MoveOn.org.

The latest version is [11.1](https://github.com/MoveOnOrg/Spoke/tree/v11.1) (see [release notes](https://github.com/MoveOnOrg/Spoke/blob/main/docs/RELEASE_NOTES.md#v111))


## Setting up Spoke


The easiest way to get started is with Heroku.  You can also learn about Spoke through the [texter](https://youtu.be/EqE1UDvKGco) and [admin](https://youtu.be/PTMykMX8gII) video demos or in the explanation on [how to decide if Spoke is right for you.](/docs/EXPLANATION_DECIDING_ON_SPOKE.md)

For developers, please see our recommendations for [deploying locally for development](/docs/HOWTO_DEVELOPMENT_LOCAL_SETUP.md).

Want to know more?
[Click here to visit the Spoke Documentation microsite!](https://moveonorg.github.io/Spoke/)


### Quick Start with Heroku
This version of Spoke suitable for testing and, potentially, for small campaigns. This won't cost any money and will not support production(aka large-scale) usage. It's a great way to practice deploying Spoke or see it in action.  

<a href="https://heroku.com/deploy?template=https://github.com/MoveOnOrg/Spoke/tree/v11.1">

  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

Follow up instructions located [here](/docs/HOWTO_HEROKU_DEPLOY.md).


**NOTE:** You can upgrade this deployment later for use in a production setting, but keep in mind you will need to migrate data from any prior campaigns.  Thus it is best to upgrade before you start any live campaigns.  This will cost ~$75 ($25 dyno + $50 postgres) a month and should be suitable for production level usage for most organizations. We recommend that if you plan to use Spoke at scale that you use [this link to deploy with a production infrastructure from the start!](https://heroku.com/deploy?template=https://github.com/MoveOnOrg/Spoke/tree/heroku-button-paid)

Please let us know if you deployed by filling out this form [here](https://act.moveon.org/survey/tech/)


### Other Options for Production Use

You can also [deploy on AWS Lambda.](docs/HOWTO_DEPLOYING_AWS_LAMBDA.md) which is a lot cheaper than Heroku at scale, but requires considerably more technical knowledge to deploy and maintain. We recommend this option for large scale campaigns with tech resources.

Additional guidance:
- [Choosing a set-up for production](docs/EXPLANATION_CHOOSE_A_SETUP.md)
- [How to hire someone to install Spoke](docs/HOWTO_HIRE_SOMEONE_TO_INSTALL_SPOKE.md)
- [Option for minimalist deployment](docs/HOWTO_MINIMALIST_DEPLOY.md)

# License

Spoke is licensed under the [GPL3 license with a special author attribution requirement](LICENSE).
