import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-claim-tree',
  templateUrl: './claim-tree.component.html',
  styleUrls: ['./claim-tree.component.css']
})
export class ClaimTreeComponent implements OnInit {
  @Input() empNo!: string
  claims!: any[]
  treeControl = new NestedTreeControl<ClaimNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ClaimNode>();

  constructor(private auth: AuthServiceService) { }

  ngOnInit(): void {
    this.loadMedicalHistory()
    console.log('Recerived to tree', this.empNo)

  }

  hasChild = (_: number, node: ClaimNode) => !!node.children && node.children.length > 0;

  loadMedicalHistory() {
    this.auth.getClaimHistoryAll(this.empNo).subscribe(res => {
      this.claims = res.content
      console.log("claim history", this.claims)
      if (this.claims == undefined) return
      const TREE_DATA: ClaimNode[] = this.claims.map((claim: any) => ({
        name: `${claim.idText} - ${claim.title}`,
        children: [
          { name: `Request: ${claim.requestAmount}`, data: claim },
          { name: `Deduction: ${claim.deductionAmount}`, data: claim },
          { name: `Adjust: ${claim.adjustAmount}`, data: claim },
          { name: `Paid: ${claim.paidAmount}`, data: claim },
          {
            name: `Claim ID: ${claim.claimIds}`,
            children: [],
          },
          // Add more fields as needed
        ],
      }));
      this.dataSource.data = TREE_DATA;
    })

  }
}
export interface ClaimNode {
  name: string;
  children?: ClaimNode[];
  data?: any;
}