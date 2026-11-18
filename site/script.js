// Project data. Status is "Completed" only for work that is actually finished.
// Links stay empty until real ones exist: nothing here claims work that is not done.
const projects = [
  {
    title: "AWS Hospital Management System",
    status: "Completed",
    summary:
      "A multi-tier hospital management platform (five user roles) deployed on AWS with Terraform, monitored with CloudWatch and released through a GitHub Actions CI/CD pipeline.",
    aws: [
      "VPC",
      "ALB",
      "EC2 Auto Scaling",
      "RDS MySQL",
      "S3",
      "KMS",
      "IAM",
      "CloudWatch",
      "SNS",
      "CloudTrail",
      "Systems Manager",
      "Secrets Manager",
    ],
    tech: ["Terraform", "Docker", "GitHub Actions (OIDC)", "Node.js", "Express", "MySQL", "Linux"],
    github: "https://github.com/khalid33-i/aws-hospital-management-system",
    demo: "",
    demoNote: "Demo: stopped to save cost",
    diagram:
      "User\n  |  HTTP\n  v\nApplication Load Balancer   (public subnets)\n  |  only from ALB security group\n  v\nEC2 Auto Scaling group      (private app subnets, no SSH)\n  |  only from app security group, TLS\n  v\nRDS MySQL 8.4              (isolated DB subnets, encrypted)\n\nSupport: S3 + KMS, Secrets Manager, CloudWatch + SNS, CloudTrail\nDeploy:  GitHub Actions --OIDC--> Auto Scaling instance refresh",
    overview:
      "A fictional hospital platform with Admin, Doctor, Receptionist, Pharmacist and Patient roles, built to practice real cloud infrastructure and DevOps. All data is fictional and it is not a certified clinical system.",
    goal: "Design, deploy and document a secure three-tier environment on AWS, managed entirely as code.",
    how: "Traffic flows from an Application Load Balancer to EC2 instances in private subnets, which connect to a private RDS MySQL database. The whole environment (7 Terraform modules) is created with terraform apply and removed with terraform destroy. A new instance configures itself from user data, creates the database schema and starts the app as a systemd service.",
    security:
      "A Security Group chain (ALB, application, database) instead of open ports. No SSH and no public IPs: servers are managed through Systems Manager Session Manager. IAM roles with least privilege, IMDSv2, KMS encryption, secrets in Secrets Manager and Parameter Store, S3 Block Public Access and CloudTrail auditing. GitHub deploys with a short-lived OIDC role, so no access keys are stored.",
    scale:
      "An Auto Scaling group across two Availability Zones replaces failed instances and scales on CPU. CloudWatch alarms with SNS email alerts watch CPU, memory, disk, load balancer health and database metrics.",
    learned:
      "Troubleshooting failing health checks from instance logs, IAM trust policies for GitHub OIDC (including the new subject claim format), reusing an existing OIDC provider with a Terraform data source, and keeping cloud costs under control by destroying the stack after documenting it.",
  },
  {
    title: "Secure Static Portfolio Website on AWS",
    status: "Completed",
    summary:
      "This portfolio, served from a private S3 bucket through CloudFront and deployed automatically with GitHub Actions.",
    aws: ["S3", "CloudFront", "OAC", "IAM"],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Actions (OIDC)"],
    github: "https://github.com/khalid33-i/aws-portfolio",
    demo: "https://d2znb2lvgu973r.cloudfront.net",
    diagram:
      "User\n  |  HTTPS\n  v\nCloudFront  (cache, TLS)\n  |  Origin Access Control\n  v\nS3 bucket  (private, Block Public Access on)\n\nPlanned later with a custom domain: Route 53 + ACM",
    overview: "A static portfolio hosted on AWS without any servers to manage.",
    goal: "Serve the site fast and over HTTPS while keeping the S3 bucket unreachable from the public internet.",
    how: "Visitors connect to CloudFront, which caches the files at edge locations. CloudFront reads from S3 using Origin Access Control, so only this distribution can fetch the files. On every push to main, GitHub Actions syncs the site folder to S3 and invalidates the CloudFront cache.",
    security:
      "The bucket is private with Block Public Access on. A bucket policy trusts only this CloudFront distribution. HTTP is redirected to HTTPS. The deploy pipeline signs in with a short-lived OIDC role, so no access keys are stored in GitHub.",
    scale:
      "CloudFront and S3 scale automatically and S3 stores data redundantly across Availability Zones.",
    learned:
      "Private S3 with CloudFront OAC, keyless deployment with GitHub Actions and OIDC, and how a small mismatch in an IAM trust condition blocks role assumption.",
  },
  {
    title: "Serverless Notes / Tasks API",
    status: "Planned",
    summary:
      "A REST API for notes built with API Gateway, Lambda and DynamoDB, with no servers to run.",
    aws: ["API Gateway", "Lambda", "DynamoDB", "IAM", "CloudWatch"],
    tech: ["REST", "JSON"],
    github: "",
    demo: "",
    diagram:
      "Client\n  |\n  v\nAPI Gateway\n  |\n  v\nLambda  --> CloudWatch (logs)\n  |\n  v\nDynamoDB\n\nRoutes: GET/POST /notes, GET/PUT/DELETE /notes/{id}",
    overview: "A backend for creating, reading, updating and deleting notes.",
    goal: "Learn serverless design and REST API basics.",
    how: "API Gateway routes each request to a Lambda function, which reads or writes a DynamoDB table.",
    security:
      "Each Lambda gets an IAM role limited to the one table it needs. Authentication and throttling are planned.",
    scale: "Lambda and DynamoDB scale with request volume.",
    learned: "To be added when the project is complete.",
  },
];

const list = document.getElementById("project-list");
const el = (tag, text, cls) => {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  if (cls) e.className = cls;
  return e;
};
const pills = (items, cls) => {
  const ul = el("ul", "", "pills" + (cls ? " " + cls : ""));
  items.forEach((i) => ul.append(el("li", i)));
  return ul;
};

function section(dlg, heading, text) {
  dlg.append(el("h4", heading), el("p", text));
}
function linkOrNote(parent, label, url, note) {
  if (url) {
    const a = el("a", label, "btn");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    parent.append(a);
  } else {
    parent.append(el("span", note || label + ": coming soon", "note"));
  }
}

projects.forEach((p) => {
  const card = el("article", "", "project");
  card.dataset.status = p.status;
  const left = el("div");
  left.append(el("h3", p.title), el("p", p.summary), pills(p.aws), pills(p.tech, "tech"));
  const right = el("div", "", "row");
  right.append(el("span", p.status, "status " + (p.status === "Completed" ? "ok" : "plan")));
  linkOrNote(right, "GitHub", p.github);
  linkOrNote(right, "Live demo", p.demo, p.demoNote);
  const more = el("button", "View details", "btn");
  more.type = "button";
  right.append(more);
  card.append(left, right);
  list.append(card);

  const dlg = el("dialog");
  dlg.setAttribute("aria-label", p.title);
  dlg.append(el("h3", p.title), el("span", p.status, "status " + (p.status === "Completed" ? "ok" : "plan")));
  section(dlg, "Overview", p.overview);
  section(dlg, "Goal", p.goal);
  dlg.append(el("h4", "Architecture"), el("pre", p.diagram));
  section(dlg, "AWS services", p.aws.join(", "));
  section(dlg, "How it works", p.how);
  section(dlg, "Security", p.security);
  section(dlg, "Scalability and availability", p.scale);
  section(dlg, "Technologies", p.tech.join(", "));
  section(dlg, "What I learned", p.learned);
  const close = el("button", "Close", "btn primary");
  close.type = "button";
  close.addEventListener("click", () => dlg.close());
  dlg.append(close);
  document.body.append(dlg);
  more.addEventListener("click", () => dlg.showModal());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
});