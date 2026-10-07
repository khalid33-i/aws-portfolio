# Khalid Waleed: Portfolio

Static portfolio hosted on AWS: private S3 bucket, CloudFront with Origin Access Control, deployed by GitHub Actions.

## Structure
- `site/`: the website (HTML, CSS, JS)
- `.github/workflows/deploy.yml`: CI/CD, syncs `site/` to S3 and invalidates CloudFront on every push to `main`

## One-time AWS setup for CI/CD (OIDC)
1. IAM > Identity providers > add `token.actions.githubusercontent.com`, audience `sts.amazonaws.com`.
2. Create an IAM role with this trust policy (replace the placeholders):
```json
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringEquals":{"token.actions.githubusercontent.com:aud":"sts.amazonaws.com","token.actions.githubusercontent.com:sub":"repo:<GITHUB_USER>/<REPO>:ref:refs/heads/main"}}}]}
```
3. Attach a least-privilege policy: `s3:ListBucket` on the bucket, `s3:PutObject` and `s3:DeleteObject` on `bucket/*`, and `cloudfront:CreateInvalidation` on the distribution ARN.
4. GitHub repo > Settings > Secrets and variables > Actions: add `AWS_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.