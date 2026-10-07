// Project data. Status stays "Planned" or "In Progress" until the project is actually finished.
// Links stay empty until real ones exist: nothing here claims work that is not done.
const projects = [
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
  {
    title: "Scalable 3-Tier Web Application on AWS",
    status: "Planned",
    summary:
      "A production-style web application across multiple Availability Zones with a load balancer, Auto Scaling and a private database.",
    aws: [
      "VPC",
      "ALB",
      "EC2",
      "Auto Scaling",
      "RDS MySQL",
      "NAT Gateway",
      "Security Groups",
      "IAM",
      "CloudWatch",
    ],
    tech: ["MySQL"],
    github: "",
    demo: "",
    diagram:
      "Internet\n  |\n  v\nApplication Load Balancer  (public subnets)\n  |  ALB security group\n  v\nEC2 Auto Scaling group  (private app subnets)\n  |  EC2 security group\n  v\nRDS MySQL  (private DB subnets)",
    overview: "A three-tier application inside a custom VPC.",
    goal: "Practice VPC design, security groups, load balancing, scaling and database isolation.",
    how: "The load balancer receives traffic and forwards it to EC2 instances in private subnets. The instances connect to an RDS MySQL database in separate private subnets.",
    security:
      "Only the load balancer is public. Each tier accepts traffic only from the tier in front of it. The database is not publicly accessible.",
    scale:
      "Auto Scaling adds or removes instances, and resources span two Availability Zones.",
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

function section(dlg, heading, text) {
  dlg.append(el("h4", heading), el("p", text));
}
function linkOrNote(parent, label, url) {
  if (url) {
    const a = el("a", label, "btn");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    parent.append(a);
  } else {
    const s = el("span", label + ": coming soon", "status");
    parent.append(s);
  }
}

projects.forEach((p) => {
  const card = el("article", "", "project");
  card.dataset.status = p.status;
  const left = el("div");
  left.append(
    el("h3", p.title),
    el("p", p.summary),
    el("p", "AWS: " + p.aws.join(", "), "tags"),
    el("p", "Tech: " + p.tech.join(", "), "tags"),
  );
  const right = el("div", "", "row");
  right.append(el("span", p.status, "status"));
  linkOrNote(right, "GitHub", p.github);
  linkOrNote(right, "Live demo", p.demo);
  const more = el("button", "View details", "btn");
  right.append(more);
  card.append(left, right);
  list.append(card);

  const dlg = el("dialog");
  dlg.setAttribute("aria-label", p.title);
  dlg.append(el("h3", p.title), el("p", "Status: " + p.status, "status"));
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
  close.addEventListener("click", () => dlg.close());
  dlg.append(close);
  document.body.append(dlg);
  more.addEventListener("click", () => dlg.showModal());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
});

document
  .querySelectorAll("a[data-todo]")
  .forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
