// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {IERC721} from "openzeppelin-contracts/token/ERC721/IERC721.sol";

contract DDMemberProver is Prover {
    uint256 immutable blockNumber;
    // 19117727 300 days old

    constructor(uint256 _blockNnumber) {
        blockNumber = _blockNnumber;
    }

    function checkDDMembership(address _isMember) public returns (Proof memory, address, bool) {
        setChain(1, blockNumber);
        uint256 ownerBalance = IERC20(0xb24cd494faE4C180A89975F1328Eab2a7D5d8f11).balanceOf(_isMember);
        uint256 isNFTOwned = IERC721(0x25ed58c027921E14D86380eA2646E3a1B5C55A8b).balanceOf(_isMember);
        return (proof(), _isMember, ownerBalance > 0 || isNFTOwned > 0);
    }
}
